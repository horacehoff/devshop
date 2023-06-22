import {useState} from "react";
import './inputCompletor.css';

export default function InputCompletor() {
    const [possibleVals, setPossibleVals] = useState([]);
    const autoCompleteWords = ['#python', '#react', '#facebook']
    const [inputValue, setInputValue] = useState('');
    let selected_val = 0;

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            console.log("autocomplete")
            console.log(possibleVals[selected_val].props.children[1].props.children)
            setInputValue(inputValue + possibleVals[selected_val].props.children[1].props.children);
            document.getElementById('autocomplete-window').style.display = 'none';
        }
        if (e.key === 'ArrowDown') {
            console.log("arrow down")
            if (selected_val < possibleVals.length - 1) {
                selected_val += 1;
                document.getElementById("autocomplete-window").scrollTo(0, selected_val * 24);
            }
        }
        if (e.key === 'ArrowUp') {
            console.log("arrow up")
            if (selected_val > 0) {
                selected_val -= 1;
                document.getElementById("autocomplete-window").scrollTo(0, selected_val * 24);
            }
        }
        document.getElementById("li0").innerHTML = document.getElementById("li0").innerHTML.replace("👆", "");

    }


    function detectWord(truevalue) {
        setInputValue(truevalue);
        const words = truevalue.split(' ');
        const lastWord = words[words.length - 1];
        let possibleWords = autoCompleteWords.filter(word => word.startsWith(lastWord));
        // if (possibleWords.length === 1) {
        possibleWords = possibleWords.map(word => {
            const commonPart = word.slice(0, lastWord.length);
            const rest = word.slice(lastWord.length);
            return <>{commonPart}<b>{rest}</b></>
        })
        // }
        setPossibleVals(possibleWords);


        if (possibleWords.length > 0 && lastWord.length > 0) {
            // remove the 'up' emoji from the first element
            document.getElementById("li0").innerHTML = document.getElementById("li0").innerHTML.replace("👆", "");
            document.getElementById('autocomplete-window').style.display = 'block';
        } else {
            document.getElementById('autocomplete-window').style.display = 'none';
        }
    }


    return (
        <>
            <div className="autocomplete-window" id="autocomplete-window">
                <ul>
                    {possibleVals.map((val, index) => <li key={index} id={"li" + index}>👇{val}👆</li>)}
                </ul>
            </div>
            <input type="text" value={inputValue} onKeyDown={e => handleKeyPress(e)} onChange={e => {
                detectWord(e.target.value)
            }}/>
        </>
    )
}