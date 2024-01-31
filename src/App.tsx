import {useState} from "react";
import {Box, Button, ButtonGroup} from "@mui/joy";
import {DTMF} from "./DTMF.ts";
import {Keypad} from "./Keypad.tsx";
import {Game, GameProps} from "./Game.tsx";

function App() {
    const [selectedGameMode, selectGameMode] =
        useState<null | GameProps["gameMode"]>(null);

    if (selectedGameMode !== null) {
        return <Game gameMode={selectedGameMode} onFinish={() => selectGameMode(null)}/>
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1} sx={{padding: 1}}>
            <Button onClick={() => {
                selectGameMode("key");
            }}>
                Guess Key
            </Button>
            <ButtonGroup color="primary" variant="solid">
                <Button onClick={() => {
                    selectGameMode("row");
                }}>
                    Guess Row
                </Button>
                <Button onClick={() => {
                    selectGameMode("column");
                }}>
                    Guess Column
                </Button>
            </ButtonGroup>
            <Keypad
                onPress={(key) => {
                    DTMF.playKey(key);
                }}
                onRelease={() => {
                    DTMF.stop();
                }}/>
        </Box>
    );
}

export default App;
