import {Box, Button, ButtonGroup, Typography} from "@mui/joy";
import {Keypad} from "./Keypad.tsx";
import {DTMF, Key} from "./DTMF.ts";
import {useEffect, useReducer, useState} from "react";

export interface GameProps {
    gameMode: "key" | "row" | "column";
    onFinish: () => void;
}

function randomInt(max: number, ) {
    return Math.floor(Math.random() * max);
}

export function Game({gameMode, onFinish}: GameProps) {

    const [correct, setCorrect] = useState<number>(0);

    const [incorrectGuesses, setIncorrectGuesses] = useState<number[]>([]);

    const [correctCount, incrementCorrectCount] = useReducer(prev => prev + 1, 0);
    const [totalCount, incrementTotalCount] = useReducer(prev => prev + 1, 0);

    function newQuestion() {
        if (gameMode === "key") {
            const key = randomInt(11) as Key;
            DTMF.playKey(key, 200);
            setCorrect(key);
        } else if (gameMode === "row") {
            const row = randomInt(4);
            DTMF.playRow(row, 200);
            setCorrect(row);
        } else if (gameMode === "column") {
            const column = randomInt(3);
            DTMF.playColumn(column, 200);
            setCorrect(column);
        }
        setIncorrectGuesses([]);
    }

    useEffect(() => {
        newQuestion();
    }, [])

    function makeGuess(value: number) {
        if (gameMode === "row") {
            value = Math.floor(value / 3);
        } else if (gameMode === "column") {
            value = value % 3;
        }

        if (value === correct) {
            newQuestion();
            if (incorrectGuesses.length === 0) {
                incrementCorrectCount();
            }
            incrementTotalCount();
        } else {
            if (gameMode === "key") {
                DTMF.playKey(value);
            } else if (gameMode === "row") {
                DTMF.playRow(value);
            } else if (gameMode === "column") {
                DTMF.playColumn(value);
            }
            setIncorrectGuesses(prev => [...prev, value]);
        }
    }

    function playAgain() {
        if (gameMode === "key") {
            DTMF.playKey(correct);
        } else if (gameMode === "row") {
            DTMF.playRow(correct);
        } else if (gameMode === "column") {
            DTMF.playColumn(correct);
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1} sx={{padding: 1}}>
            <Typography>
                Correct: {correctCount} / {totalCount}
            </Typography>
            <ButtonGroup>
                <Button onClick={onFinish} color="danger" variant="solid">
                    Back
                </Button>
                <Button onMouseDown={playAgain} onMouseUp={() => DTMF.stop()}>
                    Hear again
                </Button>
            </ButtonGroup>
            <Keypad
                onPress={makeGuess}
                onRelease={() => {
                    DTMF.stop();
                }}
                incorrectKeys={gameMode === "key" ? incorrectGuesses : undefined}
                incorrectColumns={gameMode === "column" ? incorrectGuesses : undefined}
                incorrectRows={gameMode === "row" ? incorrectGuesses : undefined}/>
        </Box>
    );
}
