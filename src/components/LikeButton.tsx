import { actions } from "src/pages/api";
import { useFormState, useFormStatus } from "react-dom";

export function Like() {
  const [state, action] = useFormState(actions.like, { likes: 0 });
  return (
    <form action={action}>
      <input type="hidden" name="likes" value="1" />
      <Button likes={state.likes} />
    </form>
  );
}

function Button({ likes }: { likes: number }) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      Like {likes}
    </button>
  );
}
