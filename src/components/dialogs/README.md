# Dialog Components

This folder contains reusable dialog components used throughout the application. All dialogs follow a consistent design pattern and can be easily imported and used.

## Available Dialogs

### 1. SessionExpiredDialog
Shows when user's session is about to expire.

**Props:**
- `open` (boolean): Whether the dialog is open
- `onCancel` (function): Callback when user clicks Cancel (proceeds with logout)
- `onContinue` (function): Callback when user clicks Continue Login (extends session)

**Example:**
```jsx
import { SessionExpiredDialog } from "@/components/dialogs";

<SessionExpiredDialog
  open={sessionExpiredDialog}
  onCancel={handleCloseSessionDialog}
  onContinue={handleContinueLogin}
/>
```

---

### 2. LogoutConfirmationDialog
Confirms user wants to logout.

**Props:**
- `open` (boolean): Whether the dialog is open
- `onCancel` (function): Callback when user clicks Cancel
- `onConfirm` (function): Callback when user confirms logout

**Example:**
```jsx
import { LogoutConfirmationDialog } from "@/components/dialogs";

<LogoutConfirmationDialog
  open={logoutDialogOpen}
  onCancel={handleLogoutCancel}
  onConfirm={handleLogoutConfirm}
/>
```

---

### 3. DeleteConfirmationDialog
Generic confirmation dialog for delete operations.

**Props:**
- `open` (boolean): Whether the dialog is open
- `onCancel` (function): Callback when user clicks Cancel
- `onConfirm` (function): Callback when user confirms delete
- `title` (string, optional): Dialog title (default: "Confirm Delete")
- `message` (string|ReactNode, optional): Custom message to display
- `itemName` (string, optional): Name of item being deleted (for default message)

**Example:**
```jsx
import { DeleteConfirmationDialog } from "@/components/dialogs";

<DeleteConfirmationDialog
  open={deleteConfirmOpen}
  onCancel={() => setDeleteConfirmOpen(false)}
  onConfirm={handleDelete}
  itemName="the job 'Software Engineer'"
/>

// Or with custom message
<DeleteConfirmationDialog
  open={deleteConfirmOpen}
  onCancel={() => setDeleteConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Remove Item"
  message="Are you sure you want to remove this item? This action cannot be undone."
/>
```

---

### 4. JobFormDialog
Dialog wrapper for forms with sticky header and footer, scrollable body.

**Props:**
- `open` (boolean): Whether the dialog is open
- `onClose` (function): Callback when dialog is closed
- `title` (string): Dialog title
- `children` (ReactNode): Form content to display
- `onSubmit` (function): Form submit handler
- `loading` (boolean, optional): Whether form is submitting (default: false)
- `submitButtonText` (string, optional): Text for submit button (default: "Submit")
- `cancelButtonText` (string, optional): Text for cancel button (default: "Cancel")
- `maxWidth` (string, optional): Dialog max width - "xs" | "sm" | "md" | "lg" | "xl" (default: "md")

**Example:**
```jsx
import { JobFormDialog } from "@/components/dialogs";

<JobFormDialog
  open={jobDialogOpen}
  onClose={handleCancelEdit}
  title="Add New Job"
  onSubmit={handleSubmit}
  loading={loading}
  submitButtonText="Add Job"
>
  <Box className="textfield" sx={{ pt: 2 }}>
    <Grid container spacing={3}>
      {/* Your form fields here */}
    </Grid>
  </Box>
</JobFormDialog>
```

---

## Usage

All dialogs can be imported from the central index file:

```jsx
import { 
  SessionExpiredDialog,
  LogoutConfirmationDialog,
  DeleteConfirmationDialog,
  JobFormDialog 
} from "@/components/dialogs";
```

Or import individually:

```jsx
import SessionExpiredDialog from "@/components/dialogs/SessionExpiredDialog";
```

---

## Features

- ✅ Consistent styling across all dialogs
- ✅ Accessible (ARIA labels and descriptions)
- ✅ Responsive design
- ✅ Type-safe props
- ✅ Reusable and maintainable
- ✅ Sticky header/footer for form dialogs
- ✅ Scrollable body for long content

---

## Adding New Dialogs

When creating a new dialog component:

1. Create a new file in this folder: `YourDialogName.js`
2. Follow the existing pattern with proper props documentation
3. Export it from `index.js`
4. Add documentation to this README

Example structure:
```jsx
"use client";
import { Dialog, DialogTitle, ... } from "@mui/material";

/**
 * Your Dialog Component Description
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Callback when dialog is closed
 */
export default function YourDialogName({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      {/* Dialog content */}
    </Dialog>
  );
}
```

