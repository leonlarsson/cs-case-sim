export default (itemNameInput: string, isStatTrak: boolean) => {
  const prefix = isStatTrak
    ? itemNameInput.includes("★")
      ? "★ StatTrak™ "
      : "StatTrak™ "
    : "";
  const itemName = isStatTrak ? itemNameInput.replace("★", "") : itemNameInput;
  return prefix + itemName;
};
