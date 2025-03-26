/**
 * Deklaracje typów dla Figma Plugin API
 * Ten plik umożliwia korzystanie z Figma API bez błędów TypeScript
 */

declare const figma: PluginAPI;
declare const __html__: string;

type User = {
  id: string;
  name: string;
};

interface PluginAPI {
  readonly root: DocumentNode;
  currentPage: PageNode;
  readonly viewport: Viewport;
  readonly currentUser: User | null;
  notify(message: string, options?: NotificationOptions): NotificationHandler;
  createNodeFromSvg(svg: string): FrameNode;
  closePlugin(message?: string): void;
  showUI(html: string, options?: ShowUIOptions): void;
  ui: UIAPI;
}

interface UIAPI {
  show(): void;
  hide(): void;
  resize(width: number, height: number): void;
  close(): void;
  postMessage(pluginMessage: any): void;
  onmessage: ((pluginMessage: any) => void) | undefined;
}

interface Viewport {
  center: Vector;
  zoom: number;
  scrollAndZoomIntoView(nodes: SceneNode[]): void;
}

interface Vector {
  x: number;
  y: number;
}

interface NotificationOptions {
  timeout?: number;
  error?: boolean;
}

interface NotificationHandler {
  cancel: () => void;
}

interface ShowUIOptions {
  visible?: boolean;
  width?: number;
  height?: number;
  position?: { x: number, y: number };
}

interface DocumentNode extends BaseNode {
  type: "DOCUMENT";
  name: string;
  children: PageNode[];
}

interface PageNode extends BaseNode {
  type: "PAGE";
  name: string;
  selection: SceneNode[];
  children: SceneNode[];
}

interface SceneNode extends BaseNode {
  readonly type: string;
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
}

interface BaseNode {
  readonly id: string;
  readonly type: string;
  name: string;
  readonly parent: (BaseNode & ChildrenMixin) | null;
  removed: boolean;
}

interface ChildrenMixin {
  readonly children: ReadonlyArray<SceneNode>;
}

// Uzupełnijące typy dla manipulacji węzłami
interface FrameNode extends SceneNode {
  type: "FRAME";
  resize(width: number, height: number): void;
  rotation: number;
} 