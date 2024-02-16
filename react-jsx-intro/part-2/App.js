const tweetData = [
    { username: 'username1', name: 'name1', date: new Date(), message: 'message1' },
    { username: 'username2', name: 'name2', date: new Date(), message: 'message2' },
    { username: 'username3', name: 'name3', date: new Date(), message: 'message3' },
];

const App = () => (
    <div>
        {tweetData.map((tweet) => (
            <Tweet username={tweet.username} name={tweet.name} date={tweet.date.toLocaleString()} message={tweet.message} />
        ))}
    </div>
);
