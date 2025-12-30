import { useEffect, useState } from "react";
import s7 from "../images/s7.png";
import s8 from "../images/s8.png";
import s9 from "../images/s9.png";
import s10 from "../images/s10.png";
import s11 from "../images/s11.png";

const images = [s7, s8, s9, s10, s11];

export default function SkillVaultSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000); // change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider-container skillvault-slider">
            <img
                key={index}
                src={images[index]}
                alt={`SkillVault learning example ${index + 1}`}
                className="slider-image"
            />
        </div>
    );
}
