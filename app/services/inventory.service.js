
/**
 * This service file contains the service layer methods for manipulating the employee objects.
 */
var logger = require("../../logger.js");
var Promise = require('bluebird');
var orderMicroservice = require('../../config/config').props().ordersConfig;
// var Client = require('node-rest-client').Client;
// reading json file and adding it
var fs = require('fs');
var itemFile = require('../../item.json')
// var orderFile = require('../../../orders.json')
//Creating the object which will finally be exported
var itemService = {
    addItem: addItem,
    updateItem: updateItem,
    updateInventoryByOrder: updateInventoryByOrder,
    getItems: getItems,
    getItemById: getItemById,
    getInventoryOrdersByGtin: getInventoryOrdersByGtin
};

/**
 * This method prepares the actual employee document to be stored in database.
 * @param {*employee} employee
 */
function addItem(item) {
    return new Promise(function (resolve, reject) {
        var obj = {
            id: itemFile.itemData.length + 1,
            name: item.name,
            quantity: item.quantity
        }
        itemFile.itemData.push(obj);
        fs.writeFile(__dirname + "/../../item.json", JSON.stringify(itemFile), function (err) {
            if (err) {
                logger.error("Some error while adding new item in the item file");
                reject(err);
            } else {
                logger.info("item has been added successfully");
                resolve("successfully added the item in the inventory");
            }
        })
    })
}

function getItems() {
    return new Promise(function (resolve, reject) {
        if (itemFile.itemData != undefined && itemFile.itemData != null)
            resolve(itemFile.itemData);
        else {
            logger.error("Some error in fetching the items from inventory");
            reject("Some error in fetching the items from inventory");
        }
    })
}
function getItemById(itemId) {
    return new Promise(function (resolve, reject) {
        if (itemFile.itemData != undefined && itemFile.itemData != null)
            resolve(itemFile.itemData[itemId - 1]);
        else {
            logger.error("Some error in fetching the items from inventory");
            reject("Some error in fetching the items from inventory");
        }
    })
}

function getInventoryOrdersByGtin(gtin) {
    return new Promise(function (resolve, reject) {
        var index;
        if (itemFile.itemData != undefined && itemFile.itemData != null) {
            for (var i = 0; i < itemFile.itemData.length; i++) {
                if (itemFile.itemData[i].gtin == gtin) {
                    index = i;
                    break;
                } else {
                    console.log("no match found");
                }

            }
            if (index != null || index != undefined) {
                resolve(itemFile.itemData[index])
            }
            else {
                resolve();
            }
        }
        else {
            logger.error("Some error in fetching the items from inventory");
            reject("Some error in fetching the items from inventory");
        }
    })
}

function updateItem(itemId, itemQty) {
    return new Promise(function (resolve, reject) {
        itemFile.itemData[itemId - 1].quantity = itemQty;
        fs.writeFile(__dirname + "/../../item.json", JSON.stringify(itemFile), function (err) {
            if (err) {
                logger.error("Some error while updating item with id :" + itemId + " in the item file");
                reject(err);
            } else {
                logger.info("item has been updated successfully");
                resolve("successfully updated the data in the inventory");
            }
        })
    })
}

function updateInventoryByOrder(gtin, orderId, orderQty) {
    return new Promise(function (resolve, reject) {
        var index;
        if (itemFile.itemData != undefined && itemFile.itemData != null) {
            for (var i = 0; i < itemFile.itemData.length; i++) {
                console.log("*******************", itemFile.itemData[i].gtin, gtin, itemFile.itemData[i].gtin == gtin);
                if (itemFile.itemData[i].gtin == gtin) {
                    index = i;
                    break;
                } else {
                    console.log("no match found");
                }

            }
            if (index != null || index != undefined) {
                console.log("index", index, orderQty);
                itemFile.itemData[index].quantity = orderQty;
                fs.writeFile(__dirname + "/../../item.json", JSON.stringify(itemFile), function (err) {
                    if (err) {
                        logger.error("Some error while updating the item file by order Id");
                        reject(err);
                    } else {
                        logger.info("inventory has been updated successfully based on orderId");
                        resolve("inventory has been updated successfully based on orderId")
                    }
                });
            }
            else {
                resolve("inventory details for the gtin" + gtin + "was not found");
            }
        }
        // itemFile.itemData[gtin - 1].quantity -= orderQty;
        // console.log("updated itemFile is--------", itemFile.itemData);
        // fs.writeFile(__dirname + "/../../item.json", JSON.stringify(itemFile), function (err) {
        //     if (err) {
        //         logger.error("Some error while updating the item file by order Id");
        //         reject(err);
        //     } else {
        //         logger.info("inventory has been updated successfully based on orderId");
        //         resolve("inventory has been updated successfully based on orderId")
        //     }
        // });
    })
}

//Exporting allthe methods in an object
module.exports = itemService;