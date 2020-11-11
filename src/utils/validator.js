const getEmptyEntries = (obj, ignoredFields) => {
  let fields = Object.keys(obj).filter(
    (k) => obj[k] !== false && (!obj[k] || obj[k].length === 0)
  );
  if (ignoredFields) fields = fields.filter((f) => !ignoredFields.includes(f));
  return fields;
};

export { getEmptyEntries };
