const RG = (rg) => {
  rg = rg.replace(/\D/g, "");
  if (rg.length == 9)
    rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
  if (rg.length == 8)
    rg = rg.replace(/(\d{1})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");

  return rg;
};

const CPF = (cpf) => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length == 11)
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

  return cpf;
};

const Numeric = (text) => {
  return text.replace(/\D/g, "");
};

const FileName = (fileName, ext, maxSize) => {
  if (fileName.length >= maxSize) {
    let str = fileName.substring(0, maxSize - 3);
    fileName = str + "...";
  }
  return fileName + ext;
};

export { CPF, RG, Numeric, FileName };
