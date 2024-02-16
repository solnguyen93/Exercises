const Hobbies = ({ hobbies }) => (
    <ul>
        {hobbies.map((hobby) => (
            <li>{hobby}</li>
        ))}
    </ul>
);
