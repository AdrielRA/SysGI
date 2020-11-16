const getEmptyEntries = (obj, ignoredFields) => {
  let fields = Object.keys(obj).filter(
    (k) => obj[k] !== false && (!obj[k] || obj[k].length === 0)
  );
  if (ignoredFields) fields = fields.filter((f) => !ignoredFields.includes(f));
  return fields;
};

const haveChanges = (changed, original, ignore) => {
  if (!ignore) ignore = [];
  let diff = Object.keys(original).reduce((diff, key) => {
    if (changed[key] === original[key]) return diff;
    return {
      ...diff,
      [key]: original[key],
    };
  }, {});

  return Object.keys(diff).filter((key) => !ignore.includes(key));
};

export { getEmptyEntries, haveChanges };
