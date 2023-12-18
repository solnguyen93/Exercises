app.get('/', (req, res, next) => {
    try {
        res.json(items);
    } catch (err) {
        next(err);
    }
});

app.post('/', (req, res, next) => {
    try {
        const { name, price } = req.body;
        items.push({ name, price });
        res.json({ message: `Successfuly added ${name}` });
    } catch (err) {
        next(err);
    }
});

app.get('/:name', (req, res, next) => {
    try {
        const { name } = req.params; // Longhand: const name = req.params.name;
        const item = items.find((item) => item.name === name);
        if (!item) {
            throw new ExpressError('Item not found', 404);
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
});

app.patch('/:name', (req, res, next) => {
    try {
        const name = req.params.name;
        const itemIndex = items.findIndex((item) => item.name === name);
        if (itemIndex === -1) {
            throw new ExpressError('Item not found', 404);
        }
        items[itemIndex].name = req.body.name;
        items[itemIndex].price = req.body.price;
        res.json(items[itemIndex]);
    } catch (err) {
        next(err);
    }
});

app.delete('/:name', (req, res, next) => {
    try {
        const name = req.params.name;
        const itemIndex = items.findIndex((item) => item.name === name);
        if (itemIndex === -1) {
            throw new ExpressError('Item not found', 404);
        }
        items.splice(itemIndex, 1);
        res.json({ message: `Successfuly deleted ${name}` });
    } catch (err) {
        next(err);
    }
});
