import JsBarcode from "jsbarcode";
import { DOMImplementation, XMLSerializer } from "xmldom";

export default function (data: string) {
  const document = new DOMImplementation().createDocument(
    "http://www.w3.org/1999/xhtml",
    "html",
    null
  );

  const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  JsBarcode(svgNode, data, {
    displayValue: false,
    xmlDocument: document,
  });

  return new XMLSerializer().serializeToString(svgNode);
}
