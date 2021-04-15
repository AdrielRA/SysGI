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
    if (Array.isArray(changed[key])) {
      if (
        changed[key].length !== original[key].length ||
        !original[key].every((v, i) => v === changed[key][i])
      )
        return [...diff, key];
      else return diff;
    } else if (changed[key] === original[key]) {
      return diff;
    } else return [...diff, key];
  }, []);

  return diff.filter((key) => !ignore.includes(key));
};

export { getEmptyEntries, haveChanges };
