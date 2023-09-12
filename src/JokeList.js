import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokesToGet = 5 }) => {
    const [jokes, setJokes] = useState([]);
    const { isLoading, setIsLoading } = useState(true);

    /* retrieve jokes from API */
    useEffect(
        function () {
            async function getJokes() {
                let j = [...jokes];
                let seenJokes = new Set();
                try {
                    while (j.length < numJokesToGet) {
                        let res = await axios.get(
                            "https://icanhazdadjoke.com",
                            {
                                headers: { Accept: "application/json" },
                            }
                        );
                        let { ...jokeObj } = res.data;

                        if (!seenJokes.has(jokeObj.id)) {
                            seenJokes.add(jokeObj.id);
                            j.push({ ...jokeObj, votes: 0 });
                        } else {
                            console.log("duplicate found!");
                        }
                    }
                    setJokes(j);
                    setIsLoading(false);
                } catch (e) {
                    console.error(e);
                }
            }
            if (jokes.length === 0) getJokes();
        },
        [jokes, numJokesToGet]
    );

    /* empty joke list, set to loading state, and then call getJokes */

    const generateNewJokes = () => {
        setIsLoading(true);
        setJokes([]);
    };

    /* change vote for this id by delta (+1 or -1) */

    function vote(id, delta) {
        setJokes((allJokes) =>
            allJokes.map((j) =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
        );
    }

    /* render: either loading spinner or list of sorted jokes. */

    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    if (isLoading) {
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        );
    }

    return (
        <div className="JokeList">
            <button className="JokeList-getmore" onClick={generateNewJokes}>
                Get New Jokes
            </button>

            {sortedJokes.map((j) => (
                <Joke
                    text={j.joke}
                    key={j.id}
                    id={j.id}
                    votes={j.votes}
                    vote={vote}
                />
            ))}
        </div>
    );
};

export default JokeList;
