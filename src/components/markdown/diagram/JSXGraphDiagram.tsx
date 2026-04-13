import { useEffect, useRef, useState, useId } from "react";
import JXG from "jsxgraph";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export type JSXGraphDiagramProps = {
  jesseScript: string;
};

export default function JSXGraphDiagram({ jesseScript }: JSXGraphDiagramProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInstance = useRef<JXG.Board | null>(null);

  const [error, setError] = useState<string | null>(null);

  const uniqueId = useId();
  // Sanitize ID for JSXGraph compatibility (remove colons)
  const boardId = `jxgbox-${uniqueId.replace(/:/g, "")}`;

  const handleReset = () => {
    if (!boardInstance.current) {
      console.warn("Tried to clear an uninitialized board");
      return;
    }
    destroyBoard();
    initBoard();
  };

  const destroyBoard = (): void => {
    if (boardInstance.current) {
      JXG.JSXGraph.freeBoard(boardInstance.current);
      boardInstance.current = null;
    }
  };

  const reportError = (message: string | null): void => {
    setTimeout(() => {
      setError(message);
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const currentBoard = boardInstance.current;
    if (!currentBoard) return;

    const bbox = currentBoard.getBoundingBox();
    const dx = (bbox[2] - bbox[0]) * 0.05;
    const dy = (bbox[1] - bbox[3]) * 0.05;

    let newBbox: [number, number, number, number] | null = null;

    switch (e.key) {
      case "ArrowUp":
      case "k":
        newBbox = [bbox[0], bbox[1] + dy, bbox[2], bbox[3] + dy];
        break;
      case "ArrowDown":
      case "j":
        newBbox = [bbox[0], bbox[1] - dy, bbox[2], bbox[3] - dy];
        break;
      case "ArrowLeft":
      case "h":
        newBbox = [bbox[0] - dx, bbox[1], bbox[2] - dx, bbox[3]];
        break;
      case "ArrowRight":
      case "l":
        newBbox = [bbox[0] + dx, bbox[1], bbox[2] + dx, bbox[3]];
        break;
      default:
        return;
    }

    e.preventDefault();
    if (newBbox) {
      currentBoard.setBoundingBox(newBbox, false);
    }
  };

  const initBoard = () => {
    try {
      if (!boardRef.current) {
        return;
      }
      const board = JXG.JSXGraph.initBoard(boardId, {
        axis: true,
        showCopyright: false,
        keepaspectratio: false,
        pan: {
          enabled: true,
          needShift: false,
        },
        zoom: {
          factorX: 1.25,
          factorY: 1.25,
          wheel: true,
          needShift: false,
        },
      });

      boardInstance.current = board;

      if (boardRef.current) {
        boardRef.current.setAttribute("tabindex", "0");
        boardRef.current.addEventListener("keydown", handleKeyDown);
      }

      try {
        board.jc.parse(jesseScript);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        reportError(`JesseCode Error: ${msg}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to initialize board";
      reportError(`Initialization Error: ${msg}`);
    }
  };

  useEffect(() => {
    destroyBoard();

    reportError(null);

    initBoard();

    return () => {
      if (boardRef.current && handleKeyDown) {
        boardRef.current.removeEventListener("keydown", handleKeyDown);
        boardRef.current = null;
      }
      destroyBoard();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jesseScript, boardId]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to parse JesseCode: Syntax Error</AlertTitle>
          <AlertDescription className="font-mono text-xs text-wrap">
            {error}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="relative group">
          <div
            id={boardId}
            ref={boardRef}
            className="w-full aspect-3/2 rounded-lg bg-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <Button
            onClick={handleReset}
            variant="ghost"
            size="icon"
            className="absolute text-black top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Reset View</span>
          </Button>
        </div>
      )}
    </div>
  );
}
