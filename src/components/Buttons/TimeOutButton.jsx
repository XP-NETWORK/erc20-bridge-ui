import React, { useEffect, useRef, useState } from "react";

export default function TimeOutButton() {
    // const [loaderWidth, setLoaderWidth] = useState(0);
    const loaderWidth = useRef(0);
    const [interval, setInterval] = useState();

    // useEffect(() => {
    //     let inter = setInterval(() => {
    //         console.log({ loaderWidth });
    //         loaderWidth.current = loaderWidth.current + 1;
    //     }, 1000);
    //     setInterval(inter);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, []);

    return (
        <div
            // style={{ width: `${loaderWidth.current}%` }}
            className="sendTranBtn__wrapper"
        ></div>
    );
}
