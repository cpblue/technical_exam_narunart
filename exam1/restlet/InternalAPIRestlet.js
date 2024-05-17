/**
 * @module InternalAPIRestlet
 * @description This module is a Restlet that handles requests to perform CRUD operations on customers and invoices.
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define([
  "N/log",
  "./GetCustomer",
  "./CreateCustomer",
  "./CreateInvoice",
  "./UpdateCustomer",
  "./DeleteCustomer",
  "./CreateItemFee",
], function (
  log,
  getCustomer,
  createCustomer,
  createInvoice,
  updateCustomer,
  deleteCustomer
) {
  /**
   * @exports InternalAPIRestlet
   */
  let InternalAPIRestlet = {};

  /**
   * Handles the GET request based on the provided request parameters.
   *
   * @param {Object} requestParams - The request parameters.
   * @param {string} requestParams.action - The action to be performed.
   * @param {string} [requestParams.externalId] - The external ID of the customer (optional).
   * @param {string} [requestParams.customerId] - The ID of the customer (optional).
   * @returns {Object} - The response object.
   * @returns {boolean} success - Indicates whether the request was successful.
   * @returns {string} message - The message associated with the response.
   */
  InternalAPIRestlet.get = function (requestParams) {
    let action = requestParams.action;

    if (action === "getCustomer") {
      if (requestParams.externalId) {
        return getCustomer.byExternalId(requestParams.externalId);
      } else if (requestParams.customerId) {
        return getCustomer.byId(requestParams.customerId);
      }
    }

    return { success: false, message: "Invalid GET request" };
  };

  /**
   * Handles a POST request based on the provided requestBody.
   *
   * @param {Object} requestBody - The request body containing the action and data.
   * @returns {Object} - The result of the POST request.
   */
  InternalAPIRestlet.post = function (requestBody) {
    let action = requestBody.action;
    let data = requestBody.data;

    if (action === "createCustomer") {
      return createCustomer(data);
    } else if (action === "createInvoice") {
      return createInvoice(data);
    } else if (action === "createItemFee") {
      return createItemFee(data);
    }
    return { success: false, message: "Invalid POST request" };
  };

  /**
   * Handles a PUT request.
   *
   * @param {Object} requestBody - The request body containing the data to be updated.
   * @returns {Object} - The result of the update operation.
   */
  InternalAPIRestlet.put = function (requestBody) {
    let data = requestBody.data;
    if (data.externalId) {
      return updateCustomer.byExternalId(data.externalId, data);
    } else if (data.customerId) {
      return updateCustomer.byId(data.customerId, data);
    }
    return { success: false, message: "Invalid PUT request" };
  };

  /**
   * Handles the DELETE request for deleting a customer.
   * @param {Object} requestParams - The request parameters.
   * @param {string} requestParams.externalId - The external ID of the customer to delete.
   * @param {string} requestParams.customerId - The ID of the customer to delete.
   * @returns {Object} - The result of the delete operation.
   * @returns {boolean} success - Indicates whether the delete operation was successful.
   * @returns {string} message - A message describing the result of the delete operation.
   */
  InternalAPIRestlet.delete = function (requestParams) {
    if (requestParams.externalId) {
      return deleteCustomer.byExternalId(requestParams.externalId);
    } else if (requestParams.customerId) {
      return deleteCustomer.byId(requestParams.customerId);
    }
    return { success: false, message: "Invalid DELETE request" };
  };
  return InternalAPIRestlet;
});
