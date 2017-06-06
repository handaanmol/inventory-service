
/**
 * This file contains the controller methods related to manipulation of item documents.
 */

//Importing the item service.
var inventoryService = require("../services/inventory.service.js");
var logger = require("../../logger.js");

//Importing the response object
var Response = require("../response.js");
var Promise = require("bluebird");

//Creating the object to be exported.
function init(router) {
    router.route('/items')
        .post(addItem)
        .get(getItems);
    router.route('/items/:id/order')
        .post(updateInventoryByOrder);
    router.route('/items/:id')
        .put(updateItem)
        .get(getItemById)

};
/**
 * This controller method accepts the item json and passes it to the service layer for saving it as a item document.
 * @param {*} req
 *          The request json containing the payload for creating a item document.
 * @param {*} res
 *          The response json going out of controller layer.
 */
function addItem(req, res) {
    var response = new Response();
    var itemData = req.body;
    inventoryService.addItem(itemData).then(function (result) {
        response.data.item = {};
        response.status.code = "200";
        response.status.message = "Item Addition successful.";
        logger.info("Item Addition: Successful");
        res.status(200).json(response);
    }).catch(function (error) {
        logger.error("error while adding Item {{In Controller}}", error);
        response.status.code = "500";
        response.status.message = "Items were not added";
        res.status(500).json(response);
    });
}

function getItems(req, res) {
    var response = new Response();
    inventoryService.getItems().then(function (result) {
        response.data.items = result;
        response.status.code = "200";
        response.status.message = "Item fetched successfully.";
        logger.info("Item fetched successfully.");
        res.status(200).json(response);
    }).catch(function (error) {
        logger.error("error while fetching Items {{In Controller}}", error);
        response.status.code = "500";
        response.status.message = "Items were not fetched successfully";
        res.status(500).json(response);
    });
}

function getItemById(req, res) {
    var response = new Response();
    var itemId = req.params.id;
    inventoryService.getItemById(itemId).then(function (result) {
        response.data.item = result;
        response.status.code = "200";
        response.status.message = "Item with id:" + itemId + " fetched successfully.";
        logger.info("Item with id:" + itemId + " fetched successfully.");
        res.status(200).json(response);
    }).catch(function (error) {
        logger.error("error while fetching Item with id :" + itemId + " {{In Controller}}", error);
        response.status.code = "500";
        response.status.message = "Item was not fetched successfully";
        res.status(500).json(response);
    });
}

function updateItem(req, res) {
    var response = new Response();
    var itemId = req.params.id;
    var itemQty = parseInt(req.query.quantity);
    inventoryService.updateItem(itemId, itemQty).then(function (result) {
        response.data.item = {};
        response.status.code = "200";
        response.status.message = "Item Update successful.";
        logger.info("Item Updation: Successful");
        res.status(200).json(response);
    }).catch(function (error) {
        logger.error("error while updating Item {{In Controller}}", error);
        response.status.code = "500";
        response.status.message = "Items were not updated";
        res.status(500).json(response);
    });
}

function updateInventoryByOrder(req, res) {
    var response = new Response();
    var itemId = parseInt(req.params.id);
    var orderId = parseInt(req.query.orderId);
    var orderQty=parseInt(req.query.orderQty);
    inventoryService.updateInventoryByOrder(itemId, orderId,orderQty).then(function (result) {
        response.data.item = {};
        response.status.code = "200";
        response.status.message = "Inventory updated successfully by order id.";
        logger.info("Inventory updated successfully by order id.");
        res.status(200).json(response);
    }).catch(function (error) {
        logger.error("error while updating inventory {{In Controller}}", error);
        response.status.code = "500";
        response.status.message = "inventory not updated successfully";
        res.status(500).json(response);
    });
}

//Finally exporting the employee controller methods as an object.
module.exports.init = init;