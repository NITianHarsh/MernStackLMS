import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

function FormControls({ formControls = [], formData, setFormData }) {
  function renderComponentsByType(getControlItem) {
    let element = null;
    const currentItemValue = formData[getControlItem.name] || "";
    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentItemValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
          />
        );
        break;

      case "select":
        element = (
          <Select
            value={currentItemValue}
            onvalueChange={(value) =>
              setFormData({ ...formData, [getControlItem.name]: value })
            }
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
              {getControlItem.options?.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentItemValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
          />
        );
        break;

      case "checkbox":
        element = (
          <div className="flex items-center gap-2">
            <Checkbox id={getControlItem.name} name={getControlItem.name} />
            <Label
              htmlFor={getControlItem.name}
              className="text-black dark:text-white"
            >
              {getControlItem.label}
            </Label>
          </div>
        );
        break;

      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentItemValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
          />
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controlItem) => (
        <div key={controlItem.name} className="flex flex-col gap-1">
          {controlItem.componentType !== "checkbox" && (
            <Label
              htmlFor={controlItem.name}
              className="text-black dark:text-white text-sm font-medium"
            >
              {controlItem.label}
            </Label>
          )}
          {renderComponentsByType(controlItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
