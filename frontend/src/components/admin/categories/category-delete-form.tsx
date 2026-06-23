"use client";

import { useActionState } from "react";
import {
  deleteCategoryAction,
  initialCategoryActionState,
} from "@/src/lib/admin/category-actions";
import { CategoryActionMessage } from "./category-action-message";
import { CategorySubmitButton } from "./category-submit-button";

export function CategoryDeleteForm({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const [state, formAction] = useActionState(
    deleteCategoryAction,
    initialCategoryActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-3"
      onSubmit={(event) => {
        if (!confirm(`Delete ${categoryName}?`)) {
          event.preventDefault();
        }
      }}
    >
      <CategoryActionMessage state={state} />
      <input name="id" type="hidden" value={categoryId} />
      <CategorySubmitButton
        label="Delete category"
        pendingLabel="Deleting..."
        variant="danger"
      />
    </form>
  );
}
