import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Lock, LogOut, Plus, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { parseCsv } from "@/lib/csv";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AppNameSection from "./weekly-intake/AppNameSection";
import SupportNeedsSection from "./weekly-intake/SupportNeedsSection";
import ExceptionsSection from "./weekly-intake/ExceptionsSection";
import LocationSection from "./weekly-intake/LocationSection";
import DatabasePlatformsSection from "./weekly-intake/DatabasePlatformsSection";
import CloudAiServiceSection from "./weekly-intake/CloudAiServiceSection";
import ApprovedToggle from "./weekly-intake/ApprovedToggle";
import OtherNotesSection from "./weekly-intake/OtherNotesSection";
import ServerCountSection from "./weekly-intake/ServerCountSection";
import EnvironmentsSection from "./weekly-intake/EnvironmentsSection";
import StorageNeedsSection from "./weekly-intake/StorageNeedsSection";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_APPLICATIONS = 20;
const ADMIN_TOKEN_KEY = "intake-admin-token";

const createInitialFormData = () => ({
  appName: "",
  requestor: "",
  appOwner: "",
  l1Leadership: "",
  appIdApm: "",
  dateRequested: "",
  fundingAvailable: false,
  fundCode: "",
  cost: "",
  cmsFullSupport: false,
  exceptionsToCMS: "",
  backup: false,
  dr: false,
  physical: false,
  reasonForPhysical: "",
  onPrem: false,
  reasonForOnPrem: "",
  azure: false,
  locationOnPrem: false,
  dataCenterLocation: "1425",
  locationPhysical: false,
  locationReasonForPhysical: "",
  sql: false,
  oracle: false,
  otherExplain: "",
  cloudService: false,
  aiService: false,
  cloudAiNotes: "",
  prodCount: 0,
  nonProdCount: 0,
  drCount: 0,
  envProd: false,
  envNonProd: false,
  envDR: false,
  azureType: "ANF",
  azureVolume: "",
  storageOnPrem: false,
  onPremVolume: "",
  otherNotes: "",
  approved: "",
});

type ApplicationFormData = ReturnType<typeof createInitialFormData>;

interface ApplicationEntry {
  id: number;
  formData: ApplicationFormData;
  pdfFile: File | null;
  pdfError: string;
}

const createApplication = (id: number): ApplicationEntry => ({
  id,
  formData: createInitialFormData(),
  pdfFile: null,
  pdfError: "",
});

const WeeklyIntakeForm = () => {
  const [weekDate, setWeekDate] = useState(format(new Date(), "MM/dd/yyyy"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState<ApplicationEntry[]>([createApplication(1)]);
  const [submitError, setSubmitError] = useState("");
  const nextApplicationId = useRef(2);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const closePreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };
  const pdfInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "");
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isAdmin = adminToken !== "";

  const adminLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken("");
  };

  // Drop a stored token that the server no longer accepts (expired or password changed).
  useEffect(() => {
    if (!adminToken) return;
    fetch("/api/admin/status", { headers: { Authorization: `Bearer ${adminToken}` } })
      .then((response) => response.json())
      .then((result: { admin?: boolean }) => { if (!result.admin) adminLogout(); })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      const result: { token?: string; error?: string } = await response.json();
      if (!response.ok || !result.token) throw new Error(result.error ?? "Could not sign in.");
      sessionStorage.setItem(ADMIN_TOKEN_KEY, result.token);
      setAdminToken(result.token);
      setLoginOpen(false);
      setAdminPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setIsLoggingIn(false);
    }
  };
  const updateApplication = (
    id: number,
    update: (application: ApplicationEntry) => ApplicationEntry,
  ) => {
    setApplications((current) =>
      current.map((application) => (application.id === id ? update(application) : application)),
    );
  };

  const handleToggleChange = (id: number, field: string) => {
    updateApplication(id, (application) => ({
      ...application,
      formData: {
        ...application.formData,
        [field]: !application.formData[field as keyof ApplicationFormData],
      },
    }));
  };

  const handleInputChange = (id: number, field: string, value: string | number) => {
    updateApplication(id, (application) => ({
      ...application,
      formData: { ...application.formData, [field]: value },
    }));
  };

  const handlePdfChange = (id: number, file: File | undefined) => {
    updateApplication(id, (application) => {
      if (!file) return { ...application, pdfFile: null, pdfError: "" };

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return { ...application, pdfFile: null, pdfError: "Choose a PDF file." };
      }

      if (file.size > MAX_PDF_SIZE_BYTES) {
        return { ...application, pdfFile: null, pdfError: "The PDF must be 10 MB or smaller." };
      }

      return { ...application, pdfFile: file, pdfError: "" };
    });
  };

  const handleCsvLoad = async (file: File | undefined) => {
    if (!file || !adminToken) return;
    setSubmitError("");
    try {
      const records = parseCsv(await file.text());
      if (records.length === 0 || !("appName" in records[0])) {
        throw new Error("This CSV does not look like an intake export.");
      }
      if (records.length > MAX_APPLICATIONS) {
        throw new Error(`The CSV has more than ${MAX_APPLICATIONS} applications.`);
      }

      const defaults = createInitialFormData();
      let missingPdfs = 0;
      const loaded = await Promise.all(records.map(async (record) => {
        const formData: Record<string, string | number | boolean> = { ...defaults };
        for (const key of Object.keys(defaults) as (keyof ApplicationFormData)[]) {
          if (!(key in record) && !(key === "approved" && "approval" in record)) continue;
          const raw = key === "approved" && !(key in record) ? record.approval : record[key];
          const fallback = defaults[key];
          if (typeof fallback === "boolean") formData[key] = raw === "true";
          else if (typeof fallback === "number") formData[key] = Number(raw) || 0;
          else formData[key] = key === "requestor" && (raw === "true" || raw === "false") ? "" : raw;
        }
        const application = createApplication(nextApplicationId.current++);
        application.formData = formData as ApplicationFormData;
        if (record.pdf_name && /^\d+$/.test(record.id ?? "")) {
          try {
            const pdfResponse = await fetch(`/api/submissions/${record.id}/pdf`, {
              headers: { Authorization: `Bearer ${adminToken}` },
            });
            if (pdfResponse.status === 401) adminLogout();
            if (pdfResponse.ok) {
              const blob = await pdfResponse.blob();
              application.pdfFile = new File([blob], record.pdf_name, { type: "application/pdf" });
            } else {
              missingPdfs++;
            }
          } catch {
            missingPdfs++;
          }
        }
        return application;
      }));

      setApplications(loaded);
      pdfInputRefs.current = {};
      const csvWeek = records[0].weekDate || records[0].week_date;
      if (csvWeek) setWeekDate(csvWeek);
      toast.success(`Loaded ${loaded.length} application${loaded.length === 1 ? "" : "s"} from CSV for review.`);
      if (missingPdfs > 0) toast.warning(`${missingPdfs} PDF${missingPdfs === 1 ? "" : "s"} could not be loaded from the server.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read the CSV file.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  };

  const addApplication = () => {
    if (applications.length >= MAX_APPLICATIONS) return;
    const id = nextApplicationId.current++;
    setApplications((current) => [...current, createApplication(id)]);
  };

  const removeApplication = (id: number) => {
    setApplications((current) => current.filter((application) => application.id !== id));
    delete pdfInputRefs.current[id];
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    if (applications.some((application) => application.pdfError)) {
      setSubmitError("Fix the PDF attachment errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submission = new FormData();
      let pdfIndex = 0;
      const entries = applications.map((application) => {
        const currentPdfIndex = application.pdfFile ? pdfIndex++ : null;
        return {
          formData: application.formData,
          weekDate,
          pdfIndex: currentPdfIndex,
        };
      });

      submission.append("submission", JSON.stringify(entries));
      applications.forEach((application) => {
        if (application.pdfFile) submission.append("pdf", application.pdfFile);
      });

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: submission,
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to submit weekly intake forms.");
      }

      toast.success(`${applications.length} application${applications.length === 1 ? "" : "s"} submitted successfully!`);
      pdfInputRefs.current = {};
      setApplications([createApplication(nextApplicationId.current++)]);
    } catch (error) {
      console.error("Error in form submission:", error);
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
      toast.error("Could not submit the weekly intake forms.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-3">
      <Dialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) { setAdminPassword(""); setLoginError(""); }
        }}
      >
        <DialogContent className="max-w-sm">
          <form onSubmit={handleAdminLogin} className="space-y-3">
            <DialogHeader>
              <DialogTitle className="text-base">Admin sign in</DialogTitle>
              <DialogDescription className="text-xs">
                Admins can load a CSV for review and approval.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="password"
              aria-label="Admin password"
              autoComplete="current-password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              autoFocus
            />
            {loginError && <p role="alert" className="text-xs text-destructive">{loginError}</p>}
            <Button type="submit" className="w-full" disabled={isLoggingIn || !adminPassword}>
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <input
        ref={csvInputRef}
        id="csv-load"
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => handleCsvLoad(event.target.files?.[0])}
      />

      <Dialog open={preview !== null} onOpenChange={(open) => { if (!open) closePreview(); }}>
        <DialogContent className="flex h-[90vh] max-w-5xl flex-col">
          <DialogHeader>
            <DialogTitle className="truncate pr-6 text-sm">{preview?.name}</DialogTitle>
            <DialogDescription className="sr-only">PDF preview</DialogDescription>
          </DialogHeader>
          {preview && (
            <iframe src={preview.url} title={`Preview of ${preview.name}`} className="w-full flex-1 rounded border" />
          )}
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit} className="space-y-3">
        {applications.map((application, index) => {
          const { id, formData, pdfFile, pdfError } = application;
          const inputId = `pdf-attachment-${id}`;
          const errorId = `pdf-error-${id}`;
          return (
            <section key={id} className="space-y-2 rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <h2 className="text-base font-semibold">
                  Application {index + 1}{formData.appName ? `: ${formData.appName}` : ""}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <ApprovedToggle
                    value={formData.approved}
                    onChange={(value) => handleInputChange(id, "approved", value)}
                  />
                  <label htmlFor={`week-date-${id}`} className="text-xs font-medium">Date:</label>
                  <Input
                    id={`week-date-${id}`}
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={weekDate}
                    onChange={(event) => setWeekDate(event.target.value)}
                    className="h-7 w-28 px-2 py-0.5 text-xs md:text-xs"
                  />                  <label htmlFor={inputId} className="text-xs font-medium">
                    PDF (optional, up to 10 MB):
                  </label>
                  <Input
                    ref={(element) => { pdfInputRefs.current[id] = element; }}
                    id={inputId}
                    type="file"
                    accept="application/pdf,.pdf"
                    aria-describedby={pdfError ? errorId : undefined}
                    aria-invalid={Boolean(pdfError)}
                    className="h-7 w-64 px-2 py-0.5 text-xs md:text-xs"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      handlePdfChange(id, file);
                      if (
                        file &&
                        ((file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) ||
                          file.size > MAX_PDF_SIZE_BYTES)
                      ) {
                        event.currentTarget.value = "";
                      }
                    }}
                  />
                  {pdfFile && (
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={() => setPreview({ url: URL.createObjectURL(pdfFile), name: pdfFile.name })}
                    >
                      View PDF{pdfFile.name ? ` (${pdfFile.name})` : ""}
                    </button>
                  )}
                  {pdfFile && (
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={() => {
                        handlePdfChange(id, undefined);
                        const input = pdfInputRefs.current[id];
                        if (input) input.value = "";
                      }}
                    >
                      Remove PDF
                    </button>
                  )}
                  {pdfError && <span id={errorId} className="text-xs text-destructive">{pdfError}</span>}
                  {index === 0 && isAdmin && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled={isSubmitting}
                      onClick={() => csvInputRef.current?.click()}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Load from CSV
                    </Button>
                  )}
                  {applications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => removeApplication(id)}
                      disabled={isSubmitting}
                      aria-label={`Remove application ${index + 1}`}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remove application
                    </Button>
                  )}
                  {index === 0 && (
                    isAdmin ? (
                      <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={adminLogout}>
                        <LogOut className="mr-1 h-3 w-3" />
                        Admin sign out
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => setLoginOpen(true)}
                      >
                        <Lock className="mr-1 h-3 w-3" />
                        Admin sign in
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <AppNameSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                  <SupportNeedsSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                </div>
                <div className="space-y-2">
                  <ExceptionsSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                  <ServerCountSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                  />
                </div>
                <div className="space-y-2">
                  <LocationSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                  <DatabasePlatformsSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                  <CloudAiServiceSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                </div>
                <div className="space-y-2">
                  <StorageNeedsSection
                    formData={formData}
                    handleInputChange={(field, value) => handleInputChange(id, field, value)}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                  <EnvironmentsSection
                    formData={formData}
                    handleToggleChange={(field) => handleToggleChange(id, field)}
                  />
                  <OtherNotesSection
                    value={formData.otherNotes}
                    onChange={(value) => handleInputChange(id, "otherNotes", value)}
                  />
                </div>
              </div>
            </section>
          );
        })}

        <div className="flex flex-col items-center gap-2 pb-3">
          <Button
            type="button"
            variant="outline"
            onClick={addApplication}
            disabled={isSubmitting || applications.length >= MAX_APPLICATIONS}
            className="w-full md:w-1/2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add another application
          </Button>
          {applications.length >= MAX_APPLICATIONS && (
            <p className="text-sm text-muted-foreground">You can submit up to {MAX_APPLICATIONS} applications at once.</p>
          )}
          {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 md:w-1/2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting {applications.length} application{applications.length === 1 ? "" : "s"}...
              </>
            ) : (
              `Submit ${applications.length} application${applications.length === 1 ? "" : "s"}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyIntakeForm;
