import { useEffect, useState } from "react";
import s13 from "../images/s13.png";
import s14 from "../images/s14.png";
import s15 from "../images/s15.png";

const images = [s13, s14, s15];

export default function ToolsSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000); // change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider-container tools-slider">
            <img
                key={index}
                src={images[index]}
                alt={`Tools example ${index + 1}`}
                className="slider-image"
            />
        </div>
    );
}
