import { useEffect, useState } from "react";
import s1 from "../images/s1.png";
import s2 from "../images/s2.png";
import s3 from "../images/s3.png";
import s4 from "../images/s4.png";
import s5 from "../images/s5.png";
import s6 from "../images/s6.png";

const images = [s1, s2, s3, s4, s5, s6];

export default function ImageSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000); // change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider-container chatbot-slider">
            <img
                key={index}
                src={images[index]}
                alt={`Internship verification example ${index + 1}`}
                className="slider-image"
            />
        </div>
    );
}
