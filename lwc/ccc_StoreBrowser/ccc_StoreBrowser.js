/**
 * @last modified on  : 11-30-2020
**/

import { LightningElement, track, api } from 'lwc';
//Style
import cake3Styles from '@salesforce/resourceUrl/cake3Styles';
// Custom Labels
import Search from '@salesforce/label/c.Search';
import CCC_StoreBrowserHeaderTitle from '@salesforce/label/c.CCC_StoreBrowserHeaderTitle';
import CCC_NumberStoresFound from '@salesforce/label/c.CCC_NumberStoresFound';
import CCC_Search_Stores from '@salesforce/label/c.CCC_Search_Stores';
import CCC_Search_NoResultsFor from '@salesforce/label/c.CCC_Search_NoResultsFor';
import CCC_StoreBrowserTip from '@salesforce/label/c.CCC_StoreBrowserTip';
// Apex Controller Methods
import retrieveStores from '@salesforce/apex/CCC_StoreBrowserController.retriveStores';

const MAXIMUM_STORES_PER_PAGE = 2;

export default class Ccc_StoreBrowser extends LightningElement {
    
    label = {
        Search,
        CCC_StoreBrowserHeaderTitle,
        CCC_NumberStoresFound,
        CCC_Search_Stores,
        CCC_Search_NoResultsFor,
        CCC_StoreBrowserTip
    };
 
    @track searchTerm = '';
    @track retrievedData;
    @track isModalOpen = false;

    @track storesFound = false;
    @track noStoresFound = false;
    numberOfPagesList = [];
    currentPage = 1;
    @track previousDisabled = true;
    @track nextDisabled = false;
    @track currentlyVisible = [];

    @track showOpeningHours = false;


    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.noStoresFound = false;
        this.storesFound = false;
        this.retrievedData = [];
        this.currentlyVisible = [];
        this.isModalOpen = false;
    }

    submitDetails() {
        this.isModalOpen = false;
    }

    handleSearchTermChange(event) {
        var inputBox = this.template.querySelector("input");
        this.searchTerm = inputBox.value;
    }

    handleSearch() {
        retrieveStores({searchTerm : this.searchTerm})
        .then(result => {
            this.retrievedData = result;
            //console.log('result =====> ');
            //console.log(JSON.stringify(this.retrievedData));
            if (result.length > 0){
                this.noStoresFound = false;
                this.storesFound = true;
                this.getPageList(result.length);
            } else {
                this.retrievedData = [];
                this.currentlyVisible = [];
                this.noStoresFound = true;
                this.storesFound = false;
            }  
        })
        .catch(error => {
            this.retrievedData = undefined;
            window.console.log('error =====> '+JSON.stringify(error));
            if(error) {
                this.errorMsg = error.body.message;
            }
        }) 
    }

    getPageList(retrievedDataListSize){
        var numberPages = 1;
        if(retrievedDataListSize > MAXIMUM_STORES_PER_PAGE){
			numberPages = Math.floor(retrievedDataListSize/MAXIMUM_STORES_PER_PAGE);
			if (retrievedDataListSize % MAXIMUM_STORES_PER_PAGE != 0){
				numberPages ++;
			}
		}
        var pageList = [];
		for (var i = 1; i<= numberPages; i++){
			pageList.push(i);
        }
		this.numberOfPagesList = pageList;
        //console.log('getPageList, numberOfPagesList:', this.numberOfPagesList);
        
        this.currentlyVisibleStores(true);
        this.goToPage(1);
    }

    currentlyVisibleStores(isFirstTime){
        //console.log('current page: ', this.currentPage);
		var initIndex = 0;
		var finalIndex = 0;
			
        if(this.currentPage == 1){
            if(this.retrievedData.length < MAXIMUM_STORES_PER_PAGE){
                finalIndex = this.retrievedData.length - 1;
            } else {
                finalIndex = MAXIMUM_STORES_PER_PAGE - 1;
            }
        } else if (this.currentPage >= 2){
            initIndex = (this.currentPage - 1) * MAXIMUM_STORES_PER_PAGE;
            if (this.currentPage == this.numberOfPagesList.length){
                finalIndex = this.retrievedData.length - 1;
            } else {
                finalIndex = (this.currentPage * MAXIMUM_STORES_PER_PAGE) - 1;
            }
        }
        //console.log('initIndex: ', initIndex);
        //console.log('finalIndex: ', finalIndex);

        var dataOnPage = [];
        for (var i = initIndex; i<= Math.min(finalIndex, this.retrievedData.length - 1); i++){
            dataOnPage.push(this.retrievedData[i])
        }
        
        this.currentlyVisible = dataOnPage;
        //console.log('currentlyVisible: ');
        //console.log(JSON.stringify(this.currentlyVisible));

        if(isFirstTime){
            setTimeout(() => {
                if(this.numberOfPagesList.length == 1){
                    this.nextDisabled = true;
                    console.log(nextDisabled);
                }
                for(var i=1; i <= this.numberOfPagesList.length ; i++){
                    if(i!=1){
                        var restOfNumberPageButton = this.template.querySelector('[data-name="'+this.numberOfPagesList[i-1]+'"]');
                        if (restOfNumberPageButton){
                            this.template.querySelector('[data-name="'+this.numberOfPagesList[i-1]+'"]').className = 'btn btn-primary page-index slds-m-around_xx-small';
                        }
                    } else {
                        var firstNumberPageButton = this.template.querySelector('[data-name="1"]');
                        if (firstNumberPageButton){
                            this.template.querySelector('[data-name="1"]').className = 'btn btn-primary active page-index slds-m-around_xx-small';
                        }
                    }

                }
                
            }, 300);
        }
    }

    goToPreviousPage(){
		this.goToPage(parseInt(this.currentPage) - 1);
    }

    goToNextPage(){
        this.goToPage(parseInt(this.currentPage) + 1);
    }

    goToNumberPage(event){
        var buttonClicked =  event.target.dataset.name;
        this.goToPage(parseInt(buttonClicked));
    }

    goToPage(pageNumberToGoTo){
        var currentNumberPageButton = this.template.querySelector('[data-name="'+this.currentPage+'"]');
        if (currentNumberPageButton){
            this.template.querySelector('[data-name="'+this.currentPage+'"]').className = 'btn btn-primary page-index slds-m-around_xx-small';
        }
        var goToNumberPageButton = this.template.querySelector('[data-name="'+pageNumberToGoTo+'"]');
        if (goToNumberPageButton){
            this.template.querySelector('[data-name="'+pageNumberToGoTo+'"]').className = 'btn btn-primary active page-index slds-m-around_xx-small'
        }

        this.currentPage = pageNumberToGoTo;
        if (this.currentPage == 1){
            this.previousDisabled = true;
            this.nextDisabled = false;
        } else if (this.currentPage == this.numberOfPagesList.length){
            this.previousDisabled = false;
            this.nextDisabled = true;
        } else {
            this.previousDisabled = false;
            this.nextDisabled = false;
        }
        
        //console.log('pageNumberToGoTo: ', pageNumberToGoTo);
        //console.log('previousDisabled: ', this.previousDisabled);
        //console.log('nextDisabled: ', this.nextDisabled);
        this.currentlyVisibleStores(false);
    }

    selectedStore(event){
        store = {
            storeId: event.target.dataset.id,
            storeName: event.target.dataset.name
        }

        const updateStoreInfoEvent = new CustomEvent("updatestoreinfo", { detail: store });
        this.dispatchEvent(updateStoreInfoEvent);

        this.closeModal();
    }
}