// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

(function () {
    "use strict";
    var searchBox, listElement, searchBtn, progressBar;
    var allBhajans = p1.concat(p2, p3, p4, p5);
    var filteredBhajans = allBhajans;
    var timeout;
    var evtdata;
    var cancel = false;
    var busy = false;

    var delayedSearch = (evt) => {
        cancel = true;
        clearTimeout(timeout);
        timeout = 0;
        evtdata = evt;
        //timeouts.push(setTimeout(onSearch, 1));
        var startSearch = () => {
            if(!busy){
                clearTimeout(timeout);
                onSearch();
            }
            else{ 
                timeout = setTimeout(startSearch, 250);
            }
        }

        startSearch();
    }

    var onSearch = async(evt) => {
        cancel = false;
        busy = true;
        evt = evtdata;
        var searchKey = evt.target.value;
        if (!searchKey || searchKey === '') {
            filteredBhajans = allBhajans;
            updateList();
        }
        else {
            filteredBhajans = [];

            filteredBhajans =  await  getFilterPromise( () => filterListUsingIndex(searchKey, allBhajans));
            if(!cancel && filteredBhajans.length == 0){
                filteredBhajans = await  getFilterPromise( () => filterList(searchKey, allBhajans));
            }
            if(!cancel){
                updateList();
            }
        }
        busy = false;
    }

    var getFilterPromise = (filterFunc) => {
        return new Promise(resolve => {
            setTimeout(async() => {
                if (cancel) {
                    resolve([]);
                } else {
                    resolve(filterFunc());
                }
            }, 1);
        });
    }

    var filterListUsingIndex = (searchKey, list) => {
        var fi, fa = [];
        searchKey = searchKey.toLowerCase();
        fi = indexData[searchKey];
        if(fi === undefined) {
            searchKey = searchKey.replace(/aa/g, "a")
                .replace(/ee/g, "i")
                .replace(/oo/g, "u");

            fi = indexData[searchKey];

            if(fi === undefined) {
                searchKey = searchKey.replace(/dhd/g, "ddh");
                fi = indexData[searchKey];

                if(fi === undefined) {
                    searchKey = searchKey.replace(/jny/g, "dny")
                        .replace(/gny/g, "dny")
                        .replace(/jhy/g, "dny");
                    fi = indexData[searchKey];

                    if(fi === undefined) {
                        searchKey = searchKey.replace(/ghy/g, "dny")
                            .replace(/gy/g, "dny");
                        fi = indexData[searchKey];

                        if(fi === undefined) {
                            searchKey = searchKey.replace(/amh/g, "ahm");
                            fi = indexData[searchKey];
                        }
                    }
                }
            }
        }

        if(fi !== undefined){
            fi.forEach(indx => {
                fa.push(allBhajans[indx]);
            });
        }

        return fa;
    }

    var filterList = (searchKey, list) => {
        
        var searchKeyLowerCase = searchKey.toLowerCase();
        if (searchKeyLowerCase.match(/[a-z]/i)) {
            // alphabet letters found
            var filteredList =  list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase) );
            //console.log("matched: " +  filteredList.length);
            if (filteredList.length == 0) {
                searchKeyLowerCase = searchKeyLowerCase.replace(/aa/g, "a")
                    .replace(/ee/g, "i")
                    .replace(/oo/g, "u");

                filteredList =  list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                if (filteredList.length == 0) {
                    searchKeyLowerCase = searchKeyLowerCase.replace(/dhd/g, "ddh");
                    filteredList =  list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                    if (filteredList.length == 0) {
                        searchKeyLowerCase = searchKeyLowerCase.replace(/jny/g, "dny")
                            .replace(/gny/g, "dny")
                            .replace(/jhy/g, "dny");
                        filteredList =  list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                        if (filteredList.length == 0) {
                            searchKeyLowerCase = searchKeyLowerCase.replace(/ghy/g, "dny")
                                .replace(/gy/g, "dny");
                            filteredList =  list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                            if (filteredList.length == 0) {
                                searchKeyLowerCase = searchKeyLowerCase.replace(/amh/g, "ahm");
                                filteredList =  list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));
                            }
                        }
                    }
                }
            }
        }
        else {
            filteredList =  list.filter(bhajan => bhajan.hin.includes(searchKey));
        }
        return filteredList;
    }

    var updateList = () => {
        const markup = `${filteredBhajans.map(bhajan => `<div class="item"><a href="./bhajan.html?b=${bhajan.vol}-${bhajan.pn}"><span style="float: left;">${bhajan.hin}</span><span style="float: right;">${bhajan.vol} - ${bhajan.pn}</span></a></div>`).join('<div style="clear:both; width:0; height:0"></div>')}`;
        listElement.innerHTML = markup;
    }


    var onDeviceReady = () => {
        searchBox = document.getElementById('searchBox');
        //searchBtn = document.getElementById('searchBtn');
        progressBar = document.getElementById('progressBar');
        listElement = document.getElementById('BhajanList');
        searchBox.addEventListener('input', delayedSearch, false);
        //document.addEventListener("searchbutton", onSearchBtnClicked, false);
        //searchBtn.addEventListener('click', onSearchBtnClicked, false);
        updateList();
    };

    window.addEventListener('load', onDeviceReady, false);
} )();
