async function checkout(formData: FormData) {
  return { success: true };
}

let likes = 0;

async function like() {
  likes++;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { likes };
}

export const actions = { checkout, like };
