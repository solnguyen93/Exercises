import unittest
from flask import Flask
from models import db, Cupcake
from app import app

class TestCupcakeApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'  # Use a test database
        self.app = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_all_cupcakes1(self):
        """Test GET all cupcakes."""
        with app.app_context():
            response = self.app.get('/api/cupcakes')
            data = response.get_json()

            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['cupcake']), 0)  # Assuming no cupcakes initially

    def test_get_all_cupcakes2(self):
        """Test GET all cupcakes."""
        with app.app_context():
            cupcake = Cupcake(flavor='test_flavor', size='test_size', rating=9.5, image='test_image')
            db.session.add(cupcake)
            new_cupcake = Cupcake(flavor='vanilla', size='small', rating=8.5, image='example.com')
            db.session.add(new_cupcake)
            db.session.commit()

            # Make the GET request again
            response = self.app.get('/api/cupcakes')
            data = response.get_json()

            # Check the response data
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['cupcake']), 2)  # Check that there are now 2 cupcakes in the response

    def test_get_a_cupcake(self):
        """Test GET a single cupcake."""
        with app.app_context():
            cupcake = Cupcake(flavor='test_flavor', size='test_size', rating=9.5, image='test_image')
            db.session.add(cupcake)
            db.session.commit()

            response = self.app.get('/api/cupcakes/1')
            data = response.get_json()

            self.assertEqual(response.status_code, 200)
            self.assertEqual(data['cupcake']['flavor'], 'test_flavor')

    def test_create_cupcake(self):
        """Test POST to create a cupcake."""
        with app.app_context():
            new_cupcake = {
                'flavor': 'new_flavor',
                'size': 'new_size',
                'rating': 8.0,
                'image': 'new_image'
            }

            response = self.app.post('/api/cupcakes', json=new_cupcake)
            data = response.get_json()

            self.assertEqual(response.status_code, 201)
            self.assertEqual(data['cupcake']['flavor'], 'new_flavor')

    def test_update_cupcake(self):
        with app.app_context():
            # Create a cupcake
            new_cupcake = Cupcake(flavor='vanilla', size='small', rating=8.5, image='example.com')
            db.session.add(new_cupcake)
            db.session.commit()

            # Send a PATCH request to update the cupcake
            response = self.app.patch('/api/cupcakes/1', json={'rating': 9.0})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['cupcake']['rating'], 9.0)

    def test_delete_cupcake(self):
        with app.app_context():
            # Create a cupcake
            new_cupcake = Cupcake(flavor='chocolate', size='large', rating=9.2, image='example.com')
            db.session.add(new_cupcake)
            db.session.commit()

            # Send a DELETE request to delete the cupcake
            response = self.app.delete('/api/cupcakes/1')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['message'], 'deleted')

    def test_get_a_cupcake_not_found(self):
        """Test GET a cupcake that does not exist."""
        with app.app_context():
            response = self.app.get('/api/cupcakes/1')
            self.assertEqual(response.status_code, 404)

    def test_update_cupcake_not_found(self):
        """Test PATCH a cupcake that does not exist."""
        with app.app_context():
            response = self.app.patch('/api/cupcakes/1', json={'rating': 9.0})
            self.assertEqual(response.status_code, 404)

    def test_delete_cupcake_not_found(self):
        """Test DELETE a cupcake that does not exist."""
        with app.app_context():
            response = self.app.delete('/api/cupcakes/1')
            self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
