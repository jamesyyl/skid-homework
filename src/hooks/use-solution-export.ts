import { useCallback, useMemo } from "react";
import { type FileItem, type Solution } from "@/store/problems-store";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface OrderedSolution {
  item: FileItem;
  solutions: Solution;
}

export function useSolutionExport(orderedSolutions: OrderedSolution[]) {
  const { t } = useTranslation("commons", { keyPrefix: "solutions" });

  const exportableSolutions = useMemo(
    () => orderedSolutions.filter((entry) => entry.solutions.problems.length),
    [orderedSolutions],
  );

  const buildMarkdownDocument = useCallback(() => {
    const lines: string[] = [];
    lines.push(`# ${t("export.document-title")}`);
    lines.push("");

    exportableSolutions.forEach((entry, pageIndex) => {
      lines.push(
        `## ${t("export.page-heading", {
          index: pageIndex + 1,
          name: entry.item.displayName,
        })}`,
      );
      lines.push("");

      entry.solutions.problems.forEach((problem, problemIdx) => {
        lines.push(
          `### ${t("export.problem-heading", { index: problemIdx + 1 })}`,
        );
        lines.push("");

        const ensureContent = (val: string | undefined | null, fb: string) =>
          val && val.trim().length > 0 ? val : fb;

        lines.push(`**${t("export.problem-label")}**`);
        lines.push("");
        lines.push(
          ensureContent(problem.problem, t("export.placeholders.problem")),
        );
        lines.push("");

        lines.push(`**${t("export.answer-label")}**`);
        lines.push("");
        lines.push(
          ensureContent(problem.answer, t("export.placeholders.answer")),
        );
        lines.push("");

        lines.push(`**${t("export.explanation-label")}**`);
        lines.push("");
        lines.push(
          ensureContent(
            problem.explanation,
            t("export.placeholders.explanation"),
          ),
        );
        lines.push("");
      });
    });

    return lines.join("\n");
  }, [exportableSolutions, t]);

  const handleExportMarkdown = useCallback(() => {
    if (!exportableSolutions.length) {
      toast.error(t("export.empty.title"), {
        description: t("export.empty.description"),
      });
      return;
    }

    try {
      const markdown = buildMarkdownDocument();
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = url;
      link.download = `${t("export.filename-prefix")}-${timestamp}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 0);

      toast.success(t("export.success.title"), {
        description: t("export.success.description"),
      });
    } catch (error) {
      console.error("Failed to export markdown", error);
      toast.error(t("export.error.title"), {
        description: t("export.error.description"),
      });
    }
  }, [buildMarkdownDocument, exportableSolutions.length, t]);

  return {
    handleExportMarkdown,
    hasExportableContent: exportableSolutions.length > 0,
  };
}
