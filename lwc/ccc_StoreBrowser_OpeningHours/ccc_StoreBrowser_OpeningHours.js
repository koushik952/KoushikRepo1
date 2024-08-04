/**
 * @last modified on  : 11-26-2020
**/

import { LightningElement, track, api } from 'lwc';
//Style
import cake3Styles from '@salesforce/resourceUrl/cake3Styles';
// Custom Labels
import CCC_Search_OpeningHours from '@salesforce/label/c.CCC_Search_OpeningHours';
import CCC_Search_RegularHours from '@salesforce/label/c.CCC_Search_RegularHours';
import CCC_Search_HolidayHours from '@salesforce/label/c.CCC_Search_HolidayHours';
import CCC_Search_OtherHours from '@salesforce/label/c.CCC_Search_OtherHours';
import CCC_Search_Closed from '@salesforce/label/c.CCC_Search_Closed';


export default class Ccc_StoreBrowser_OpeningHours extends LightningElement {

    label = {
        CCC_Search_OpeningHours,
        CCC_Search_RegularHours,
        CCC_Search_HolidayHours,
        CCC_Search_OtherHours,
        CCC_Search_Closed
    };

    @api openingHours;
    @track showOpeningHours = false;
    @track regularHoursList = [];
    @track holidayHoursList = [];
    @track otherHoursList = [];
    @track hasRegularHours = false;
    @track hasHolidayHours = false;
    @track hasOtherHours = false;
    @track regularHoursBottomLine = '';
    @track holidayHoursBottomLine = '';
    
    connectedCallback(){
        var regularHours = [];
        var holidayHours = [];
        var otherHours = [];

        if(this.openingHours){
            for(var i = 0; i < this.openingHours.length; i++){
                if(this.openingHours[i].recordTypeName == 'Regular Hours'){
                    regularHours.push(this.openingHours[i]);
                } else if(this.openingHours[i].recordTypeName == 'Holiday Hours'){
                    holidayHours.push(this.openingHours[i]);
                } else if(this.openingHours[i].recordTypeName == 'Other Hours'){
                    otherHours.push(this.openingHours[i]);
                }
            }

            // Regular Hours
            if(regularHours.length > 0){
                this.regularHoursList = regularHours;
                this.hasRegularHours = true;
            } else {
                this.hasRegularHours = false;
            }

            // Holiday Hours
            if(holidayHours.length > 0){
                holidayHours.sort(function (a, b) {
                    if (a.holidayDate > b.holidayDate) {return 1;}
                    if (a.holidayDate < b.holidayDate) {return -1;}
                    return 0;
                });
                this.holidayHoursList = holidayHours;
                this.hasHolidayHours = true;
            } else {
                this.hasHolidayHours = false;
            }

            // Other Hours
            if(otherHours.length > 0){
                var otherHourWrapperList = this.otherHoursWrapper(otherHours);
                this.otherHoursList = otherHourWrapperList;
                this.hasOtherHours = true;
            } else {
                this.hasOtherHours = false;
            }                
            
            // Bottom Line style
            if(this.holidayHoursList.length > 0 || this.otherHoursList.length > 0){
                this.regularHoursBottomLine = 'slds-col slds-size--1-of-1 regularHoursBlock bottomBorder ';
            } else {
                this.regularHoursBottomLine = 'slds-col slds-size--1-of-1 regularHoursBlock ';
            }

            if(this.otherHoursList.length > 0){
                this.holidayHoursBottomLine = 'slds-col slds-size--1-of-1 regularHoursBlock bottomBorder ';
            } else {
                this.holidayHoursBottomLine = 'slds-col slds-size--1-of-1 regularHoursBlock ';
            }
            
        }        
        //console.log('regularHoursList: ', JSON.stringify(this.regularHoursList));
        //console.log('holidayHoursList: ', JSON.stringify(this.holidayHoursList));
        //console.log('otherHoursList: ', JSON.stringify(this.otherHoursList));
    }

    otherHoursWrapper(otherHours){
        var otherHoursWrapperList = [];
        var otherHoursMap = new Map();
        var hoursPerName = [];
        var otherHoursNames = [];

        for (var i=0; i<otherHours.length; i++){
            if (otherHoursMap[otherHours[i].otherHoursName]){
                hoursPerName = otherHoursMap[otherHours[i].otherHoursName];
                hoursPerName.push(otherHours[i]);
            } else {
                hoursPerName = [];
                hoursPerName.push(otherHours[i]);
                otherHoursNames.push(otherHours[i].otherHoursName);
            }
            otherHoursMap[otherHours[i].otherHoursName] = hoursPerName;
        }

        for(var i=0; i<otherHoursNames.length; i++){
            otherHoursWrapperList.push({
                name: otherHoursNames[i],
                validFrom: otherHoursMap[otherHoursNames[i]][0].validFrom,
                validTo: otherHoursMap[otherHoursNames[i]][0].validTo,
                listOfDaysAndHours: otherHoursMap[otherHoursNames[i]]
            });
        }

        return otherHoursWrapperList;
    }

    displayOpeningHours(){
        if(this.showOpeningHours == true){
            this.showOpeningHours = false;
        } else {
            this.showOpeningHours = true;            
        }
    }

}