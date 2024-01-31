import {Key} from "./DTMF.ts";
import {SxProps} from "@mui/joy/styles/types";
import {Box, Button} from "@mui/joy";
import {useEffect, useRef} from "react";

interface KeypadProps {
    onPress: (key: Key) => void;
    onRelease: () => void;
    incorrectKeys?: Key[];
    incorrectRows?: number[];
    incorrectColumns?: number[];
}

export function Keypad({onPress, onRelease, incorrectKeys, incorrectRows, incorrectColumns}: KeypadProps) {
    const buttonsRef = useRef<Array<HTMLAnchorElement | null>>([])

    const keysMap: { [key: string]: Key } = {
        "1": Key.k1,
        "2": Key.k2,
        "3": Key.k3,
        "4": Key.k4,
        "5": Key.k5,
        "6": Key.k6,
        "7": Key.k7,
        "8": Key.k8,
        "9": Key.k9,
        "*": Key.kAsterisk,
        "0": Key.k0,
        "#": Key.kHash,
    };

    const buttons = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["*", "0", "#"],
    ];

    useEffect(() => {
        const keydownListener = (e: KeyboardEvent) => {
            const key = keysMap[e.key];
            if (key !== undefined) {
                buttonsRef.current[key]?.dispatchEvent(new MouseEvent("mousedown", {
                    bubbles: true,
                }));
            }
        }
        const keyupListener = (e: KeyboardEvent) => {
            const key = keysMap[e.key];
            if (key !== undefined) {
                buttonsRef.current[key]?.dispatchEvent(new MouseEvent("mouseup", {
                    bubbles: true,
                }));
            }
        }

        document.addEventListener("keydown", keydownListener);
        document.addEventListener("keyup", keyupListener);

        return () => {
            document.removeEventListener("keydown", keydownListener);
            document.removeEventListener("keyup", keyupListener);
        };
    }, [])

    const rows = buttons.map((row, rowIndex) => (
        <Box key={"row-" + rowIndex} display="flex">
            {row.map((keyString, columnIndex) => {
                const key = keysMap[keyString];

                const borders: SxProps = {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderRight: 0,
                    borderBottom: 0,
                };

                if (keyString === "1") {
                    borders.borderTopLeftRadius = 16;
                } else if (keyString === "3") {
                    borders.borderTopRightRadius = 16;
                } else if (keyString === "*") {
                    borders.borderBottomLeftRadius = 16;
                } else if (keyString === "#") {
                    borders.borderBottomRightRadius = 16;
                }

                if (columnIndex === 2) {
                    delete borders.borderRight;
                }
                if (rowIndex === 3) {
                    delete borders.borderBottom;
                }

                const incorrect = incorrectKeys?.includes(key)
                    || incorrectRows?.includes(rowIndex)
                    || incorrectColumns?.includes(columnIndex);

                return (
                    <Button
                        ref={el => buttonsRef.current[key] = el}
                        key={"key-" + keyString}
                        sx={{
                            width: 96,
                            height: 96,
                            boxSizing: "border-box",
                            padding: 0,
                            fontSize: 32,
                            userSelect: 'none',
                            ...borders,
                        }}
                        variant={incorrect ? "solid" : "outlined"}
                        color={incorrect ? "danger" : "primary"}
                        onMouseDown={() => {
                            onPress(key);
                        }}
                        onMouseUp={() => {
                            onRelease();
                        }}
                    >
                        {keyString}
                    </Button>
                );
            })}
        </Box>
    ));

    return (
        <Box>
            {rows}
        </Box>
    );
}
