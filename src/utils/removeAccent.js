

export default function removeVietnameseAccent(str) {
    return str
      .normalize("NFD") // Normalize the string into decomposed form
      .replace(/[\u0300-\u036f]/g, "") // Remove the accent characters
      .replace(/đ/g, "d") // Replace 'đ' with 'd'
      .replace(/Đ/g, "D"); // Replace 'Đ' with 'D'
  }

  