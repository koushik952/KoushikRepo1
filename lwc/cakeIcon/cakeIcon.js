/**
 * @Description        : renders the specified icon from the Cake3 svg icons.
                        This component does not include the cake3 css styles, it just renders svg icons,
                        so in case you want to combine it with cake3 styles, import it in your parent component.
 * @Author             : samuel.esteban@lidl.es
**/
import cake3Styles from '@salesforce/resourceUrl/cake3Styles';

import { LightningElement, api, track } from 'lwc';

export default class CakeIcon extends LightningElement {
    
    /**
     * By default 'path' is the path to cake's 3 icons. If a different svg file is desired
     * use this attribute with the svg path.
     */
    @api path = cake3Styles + '/images/icon__sprite.svg';
    
    /**
     * The specific icon inside the svg specified in the 'path' attribute.
     */
    @api iconName = null;
    @api placeHolder;
    @api color = null;
    @api styleClass = '';
    @track _styleClass = 'icon';
    
    connectedCallback(){
        this._styleClass += ' '+this.styleClass;

        this.svgURL = this.path;
        if(this.iconName != null){
            this.svgURL += "#"+this.iconName;
        }
        //console.log("this.svgURL", this.svgURL);
    }

    get isColorSet(){
        return this.color != null;
    }

}