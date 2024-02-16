const Person = ({ name, age, hobbies }) => (
    <div class="person">
        <p> Learn some information about this person. </p>
        <ul>
            <li>Name: {name.length <= 8 ? name : name.slice(0, 6)}</li>
            <li>Age: {age}</li>
            <li>
                Hobbies: <Hobbies hobbies={hobbies} />
            </li>
        </ul>
        <h3> {age >= 18 ? 'Please go vote!' : 'You must be 18.'} </h3>
    </div>
);
