import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import {
  ChangeEvent,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useTranslation } from "react-i18next";
import { useConfirm } from "material-ui-confirm";
import { RunRecord } from "@/entity";
import { dateUtil } from "@/utils";

export const CreateRecordDialogProviderContext = createContext<
  CreateRecordDialogProviderContextValue | undefined
>(undefined);

export type CreateRecordDialogProviderProps = {
  children: ReactNode;
  onSubmit: (record: RunRecord) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
};

export function useCreateRecordDialog(): CreateRecordDialogProviderContextValue {
  const context = useContext(CreateRecordDialogProviderContext);
  if (context === undefined) {
    throw new Error(
      "useCreateRecordDialog must be used within a CreateRecordDialogProvider"
    );
  }
  return context;
}

export type CreateRecordDialogProps = {
  open: boolean;
  onSubmit: (record: RunRecord) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
};

const InitForm = (date?: Date) =>
  new RunRecord("", {
    date: date ? dateUtil.toDateString(date) : "",
    title: "",
    description: "",
    distance: "" as any,
    isRace: false,
    raceTime: "",
  });

export function RecordDialog(props: CreateRecordDialogProps): ReactNode {
  const { open, onSubmit: _onSubmit, onRemove: _onRemove } = props;

  const { date, record, toggleDialog } = useCreateRecordDialog();
  const { t } = useTranslation();
  const confirm = useConfirm();

  const [form, setForm] = useState<RunRecord>(InitForm(date!));

  const handleChange = useCallback(
    ({ target }: ChangeEvent<{ name: keyof RunRecord; value: any }>) => {
      setForm((f) => f.withUpdate(target));
    },
    []
  );

  const handleCancel = useCallback(() => {
    toggleDialog();
    setTimeout(() => {
      setForm(InitForm(date));
    }, 0);
  }, []);

  const onSubmit = useCallback(() => {
    _onSubmit(
      form.withUpdate({
        name: "distance",
        value: parseFloat(form.distance as any),
      })
    );
    setTimeout(() => {
      setForm(InitForm(date));
    }, 0);
  }, [_onSubmit, form, date]);

  const onRemove = useCallback(async () => {
    try {
      await confirm({
        title: t("pages.planner.createDialog.removeConfirm.title"),
        description: t("pages.planner.createDialog.removeConfirm.description"),
        cancellationText: t("pages.planner.createDialog.removeConfirm.cancel"),
        cancellationButtonProps: {
          sx: (theme) => ({
            color: theme.palette.grey[500],
          }),
        },
        confirmationText: t("pages.planner.createDialog.removeConfirm.remove"),
        confirmationButtonProps: {
          color: "error",
        },
      });
      _onRemove(form.id);
      setTimeout(() => {
        setForm(InitForm(date));
      }, 0);
    } catch (_) {
      return undefined;
    }
  }, [_onRemove, form, date]);

  useEffect(() => {
    if (!record) return;
    setForm(record);
  }, [record, open]);

  useEffect(() => {
    setForm(InitForm(date));
  }, [date]);

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <ValidatorForm onSubmit={onSubmit}>
        <DialogTitle>{t("pages.planner.createDialog.header")}</DialogTitle>
        <DialogContent>
          <TextValidator
            name="title"
            value={form.title}
            validators={["required"]}
            errorMessages={[t("validation.required")]}
            onChange={handleChange}
            margin="dense"
            label={t("pages.planner.createDialog.title")}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextValidator
            name="description"
            value={form.description}
            validators={["required"]}
            errorMessages={[t("validation.required")]}
            onChange={handleChange}
            margin="dense"
            label={t("pages.planner.createDialog.description")}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextValidator
            name="distance"
            value={form.distance}
            validators={["required", "isFloat"]}
            errorMessages={[t("validation.required"), t("validation.isNumber")]}
            onChange={handleChange}
            margin="dense"
            label={t("pages.planner.createDialog.distance")}
            type="text"
            fullWidth
            variant="standard"
          />
          {form.isRace && (
            <TextValidator
              name="raceTime"
              value={form.raceTime}
              onChange={handleChange}
              margin="dense"
              label={t("pages.planner.createDialog.raceTime")}
              type="text"
              fullWidth
              variant="standard"
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isRace ?? false}
                onChange={(_, checked) =>
                  setForm((record) => {
                    const r = record.withUpdate({
                      name: "isRace",
                      value: checked,
                    });
                    if (!checked) {
                      r.raceTime = "";
                    }
                    return r;
                  })
                }
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("pages.planner.createDialog.isRace")}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            sx={(theme) => ({
              color: theme.palette.grey[500],
            })}
          >
            {t("pages.planner.createDialog.cancel")}
          </Button>
          {record?.id && (
            <Button onClick={onRemove} color="error">
              {t("pages.planner.createDialog.remove")}
            </Button>
          )}
          <Button type="submit">{t("pages.planner.createDialog.save")}</Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}

export type CreateRecordDialogProviderContextValue = {
  date?: Date;
  record?: RunRecord;
  toggleDialog: (date?: Date | RunRecord) => void | Promise<void>;
};

export function CreateRecordDialogProvider(
  props: CreateRecordDialogProviderProps
): ReactNode {
  const { children, onSubmit: _onSubmit, onRemove: _onRemove } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [record, setRecord] = useState<RunRecord>();

  const onSubmit = useCallback(
    async (record: RunRecord) => {
      await _onSubmit(record);
      setOpen(false);
    },
    [_onSubmit]
  );

  const onRemove = useCallback(
    async (id: string) => {
      await _onRemove(id);
      setOpen(false);
    },
    [_onRemove]
  );

  const toggleDialog = useCallback((payload?: Date | RunRecord) => {
    if (payload instanceof Date) {
      setDate(payload);
      setRecord(InitForm(payload));
    } else if (payload instanceof RunRecord) {
      setRecord(payload);
    } else {
      setDate(undefined);
      setRecord(undefined);
    }

    setOpen((o) => !o);
  }, []);

  const value: CreateRecordDialogProviderContextValue = useMemo(
    () => ({ date, record, toggleDialog }),
    [date, record, toggleDialog]
  );

  return (
    <CreateRecordDialogProviderContext.Provider value={value}>
      <RecordDialog open={open} onSubmit={onSubmit} onRemove={onRemove} />
      {children}
    </CreateRecordDialogProviderContext.Provider>
  );
}
