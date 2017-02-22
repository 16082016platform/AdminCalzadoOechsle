'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),

    service = require('./pedidos-service'),
    // additional requires

    viewModel = require('./pedidos-view-model');

var sound = require("nativescript-sound");

var audio = sound.create("~/sounds/assiduous.mp3"); // preload the audio file
function onListViewItemTap(args) {
    audio.play();
    var page = args.object;
    page.cssClass = "animacion";

    var itemData = viewModel.get('listItems')[page.index];

    // helpers.navigate({
    //     moduleName: 'components/pedidos/itemDetails/itemDetails',
    //     context: itemData.details
    // });

    if (itemData.details.estado == "Atendido") {
        return;
    }

    var dataService = require('../../dataProviders/backendServices');

    var data = dataService.data('pedidos');

    data.updateSingle({

        estado: "Atendido",

        // save properties

        Id: itemData.details.Id
    })
        .then(page.getViewById("estado" + itemData.index).text = "Atendido", page.getViewById("estado" + itemData.index).color = "green")
        .catch(page.getViewById("estado" + itemData.index).text = "Atendido", page.getViewById("estado" + itemData.index).color = "green");


}
exports.onListViewItemTap = onListViewItemTap;


function flattenLocationProperties(dataItem) {
    var propName, propValue,
        isLocation = function (value) {
            return propValue && typeof propValue === 'object' &&
                propValue.longitude && propValue.latitude;
        };

    for (propName in dataItem) {
        if (dataItem.hasOwnProperty(propName)) {
            propValue = dataItem[propName];
            if (isLocation(propValue)) {
                dataItem[propName] =
                    'Latitude: ' + propValue.latitude +
                    'Longitude: ' + propValue.longitude;
            }
        }
    }
}
// additional functions

var c = 0, t, timer_is_on = 0;
function timedCount() {
    c = c + 1;




    
    function _fetchData() {
        
        return service.getAllRecords();
    };
    _fetchData()
        .then(function (result) {
            
            var itemsList = [];
            var index = 0;
            result.forEach(function (item) {
                
                itemsList.push({
                    header: item.estado,
                    description: item.producto,
                    color: item.estado == "Pendiente" ? "red" : "green",
                    index: index,
                    // singleItem properties
                    details: item
                });
                index++;
            });
            viewModel.set('listItems', itemsList);
            viewModel.set('isLoading', false);
        })
        .catch(function onCatch() {
            viewModel.set('isLoading', false);
        });




    t = setTimeout(function () { timedCount() }, 5000);

    
    // if (c == 5) {
    //     stopCount();
    // }

    
}

function startCount() {
    //if (!timer_is_on) {
    timer_is_on = 1;
    timedCount();
    //}
}

function stopCount() {
    clearTimeout(t);
    timer_is_on = 0;
    c = 0;
}


function pageLoaded(args) {
    var page = args.object;
    helpers.platformInit(page);
    page.bindingContext = viewModel;
    // viewModel.set('isLoading', true);
    // viewModel.set('listItems', []);
    // function _fetchData() {
    //     var context = page.navigationContext;
    //     if (context && context.filter) {
    //         return service.getAllRecords(context.filter);
    //     }

    //     return service.getAllRecords();
    // };
    // _fetchData()
    //     .then(function (result) {
    //         var itemsList = [];
    //         var index = 0;
    //         result.forEach(function (item) {
    //             flattenLocationProperties(item);
    //             itemsList.push({
    //                 header: item.estado,
    //                 description: item.producto,
    //                 color: item.estado == "Pendiente" ? "red" : "green",
    //                 index: index,
    //                 // singleItem properties
    //                 details: item
    //             });
    //             index++;
    //         });
    //         viewModel.set('listItems', itemsList);
    //         viewModel.set('isLoading', false);
    //     })
    //     .catch(function onCatch() {
    //         viewModel.set('isLoading', false);
    //     });
    // additional pageLoaded
    if (isInit) {
        isInit = false;
        // additional pageInit
        startCount();
    }
}
exports.pageLoaded = pageLoaded;
