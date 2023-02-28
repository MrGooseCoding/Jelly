import React from "react";

class TextFormatter extends React.Component {
    Formatter = function(stringTag, htmlTag, string) {
        var formatted_text = []
        var last_pos = -1
        for (let i=0; i < string.split(stringTag).length - 2; i++) {
            var start_pos = string.indexOf(stringTag, last_pos + 2 -1) + stringTag.length;
            var end_pos = string.indexOf(stringTag,start_pos);
            if (end_pos === -1) {i++ } 
            last_pos = end_pos
            formatted_text.push(string.substring(start_pos,end_pos))
        } 
        return string.split(stringTag).map(
                (element, index, array) => {return (formatted_text.includes(element))?`${htmlTag[0]}${element}${htmlTag[1]}`:element} 
            ).join("")
    } 

    render () {
        var formatted_text = this.Formatter('/*', ['<b>', '</b>'], this.props.text)
        formatted_text = this.Formatter('//', ['<i>', '</i>'], formatted_text)
        formatted_text = this.Formatter('/>', ['<pre>', '</pre>'], formatted_text)

        return (<div className={this.props.className} dangerouslySetInnerHTML={{__html: formatted_text}}></div>)
    } 
}

export default TextFormatter;