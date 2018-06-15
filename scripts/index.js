// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

(function () {
    "use strict";
    var searchBox, listElement, searchBtn, progressBar;
    var allBhajans = p1.concat(p2, p3, p4);
    var filteredBhajans = allBhajans;
    var timeouts= [];
    var evtdata;
    var cancel = false;

    var delayedSearch = (evt) => {
        cancel = true;
        timeouts.forEach((timeout) => clearTimeout(timeout));
        timeouts = [];
        evtdata = evt;
        timeouts.push(setTimeout(onSearch, 500));
    }

    var onSearchBtnClicked = (evt) => {
        cancel = false;
        searchBox.setAttribute("disabled", true);
        searchBtn.setAttribute("disabled", true);
        progressBar.setAttribute("class", "visible");
        var searchKey = searchBox.value;
        if (!searchKey || searchKey === '') {
            filteredBhajans = allBhajans;
            updateList();
            searchBox.removeAttribute("disabled");
            searchBtn.removeAttribute("disabled");
            progressBar.setAttribute("class", "hidden");
        }
        else {
            var filteredBhajansPromises = [];
            filteredBhajans = [];
            filteredBhajansPromises.push(getFilterPromise(() => { filteredBhajans = filteredBhajans.concat(filterList(searchKey, p1)); }));
            filteredBhajansPromises.push(getFilterPromise(() => { filteredBhajans = filteredBhajans.concat(filterList(searchKey, p2)); }));
            filteredBhajansPromises.push(getFilterPromise(() => { filteredBhajans = filteredBhajans.concat(filterList(searchKey, p3)); }));
            filteredBhajansPromises.push(getFilterPromise(() => { filteredBhajans = filteredBhajans.concat(filterList(searchKey, p4)); }));

            Promise.all(filteredBhajansPromises).then(() => {
                if (!cancel) {
                    //console.log("updateing list...");
                    updateList();
                    searchBox.removeAttribute("disabled");
                    searchBtn.removeAttribute("disabled");
                    progressBar.setAttribute("class", "hidden");
                }
            });
        }
    }

    var onSearch = (evt) => {
        cancel = false;
        evt = evtdata;
        var searchKey = evt.target.value;
        if (!searchKey || searchKey === '') {
            filteredBhajans = allBhajans;
            updateList();
        }
        else {
            var filteredBhajansPromises = [];
            filteredBhajans = [];
            filteredBhajansPromises.push(getFilterPromise(() => {  filteredBhajans = filteredBhajans.concat(filterList(searchKey, p1));  }));
            filteredBhajansPromises.push(getFilterPromise(() => {  filteredBhajans = filteredBhajans.concat(filterList(searchKey, p2));  }));
            filteredBhajansPromises.push(getFilterPromise(() => {  filteredBhajans = filteredBhajans.concat(filterList(searchKey, p3));  }));
            filteredBhajansPromises.push(getFilterPromise(() => {  filteredBhajans = filteredBhajans.concat(filterList(searchKey, p4));  }));

            Promise.all(filteredBhajansPromises).then(() => {
                if (!cancel) {
                    //console.log("updateing list...");
                    updateList();
                }
            });
        }
    }

    var getFilterPromise = (filterFunc) => {
        return new Promise(resolve => {
            setTimeout(() => {
                if (cancel) {
                    resolve();
                } else {
                    filterFunc();
                    resolve();
                }
            }, 1);
        });
    }

    var filterList = (searchKey, list) => {
        var searchKeyLowerCase = searchKey.toLowerCase();
        var filteredList = list.filter(bhajan => bhajan.hin.includes(searchKey));
        if (filteredList.length == 0) {
            var filteredList = list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));
            if (filteredList.length == 0) {
                searchKeyLowerCase = searchKeyLowerCase.replace(/aa/g, "a")
                    .replace(/ee/g, "i")
                    .replace(/oo/g, "u");

                filteredList = list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                if (filteredList.length == 0) {
                    searchKeyLowerCase = searchKeyLowerCase.replace(/dhd/g, "ddh");
                    filteredList = list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                    if (filteredList.length == 0) {
                        searchKeyLowerCase = searchKeyLowerCase.replace(/jny/g, "dny")
                            .replace(/gny/g, "dny")
                            .replace(/jhy/g, "dny");
                        filteredList = list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                        if (filteredList.length == 0) {
                            searchKeyLowerCase = searchKeyLowerCase.replace(/ghy/g, "dny")
                                .replace(/gy/g, "dny");
                            filteredList = list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));

                            if (filteredList.length == 0) {
                                searchKeyLowerCase = searchKeyLowerCase.replace(/amh/g, "ahm");
                                filteredList = list.filter(bhajan => bhajan.eng.includes(searchKeyLowerCase));
                            }
                        }
                    }
                }
            }
        }

        return filteredList;
    }

    var updateList = () => {
        const markup = `${filteredBhajans.map(bhajan => `<div style=""><span style="float: left;">${bhajan.hin}</span><span style="float: right;">${bhajan.vol} - ${bhajan.pn}</span></div>`).join('<div style="clear:both; width:0; height:0"></div>')}`;
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