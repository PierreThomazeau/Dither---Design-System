/* Docs examples, rendered by <ComponentPreview name="..." />. Keep in sync with the files in this folder. */
import type { ComponentType } from "react";

import ActivityHeatmapDemo from "./activity-heatmap-demo";
import AgentStepCard from "./agent-step-card";
import AgentStepDemo from "./agent-step-demo";
import AlertAction from "./alert-action";
import AlertDemo from "./alert-demo";
import AnnouncementBarDemo from "./announcement-bar-demo";
import AvatarDemo from "./avatar-demo";
import AvatarGroup from "./avatar-group";
import BadgeDemo from "./badge-demo";
import ButtonDemo from "./button-demo";
import ButtonGroupDemo from "./button-group-demo";
import ButtonGroupSizes from "./button-group-sizes";
import ButtonGroupVertical from "./button-group-vertical";
import ButtonSizes from "./button-sizes";
import ButtonStates from "./button-states";
import CardDemo from "./card-demo";
import CardInset from "./card-inset";
import CardSizes from "./card-sizes";
import ChartBullet from "./chart-bullet";
import ChartCapacityBar from "./chart-capacity-bar";
import ChartColumn from "./chart-column";
import ChartCombo from "./chart-combo";
import ChartDonut from "./chart-donut";
import ChartForecast from "./chart-forecast";
import ChartFunnel from "./chart-funnel";
import ChartGauge from "./chart-gauge";
import ChartHeatmap from "./chart-heatmap";
import ChartHistogram from "./chart-histogram";
import ChartProgressBars from "./chart-progress-bars";
import ChartRanking from "./chart-ranking";
import ChartResponseCurve from "./chart-response-curve";
import ChartScatter from "./chart-scatter";
import ChartSplitBar from "./chart-split-bar";
import ChartStackedArea from "./chart-stacked-area";
import ChartTreemap from "./chart-treemap";
import ChartWaterfall from "./chart-waterfall";
import ChatComposerDemo from "./chat-composer-demo";
import ChatComposerMinimal from "./chat-composer-minimal";
import CompanionChat from "./companion-chat";
import CompanionDemo from "./companion-demo";
import CheckboxBox from "./checkbox-box";
import CheckboxDemo from "./checkbox-demo";
import ChipDemo from "./chip-demo";
import CommandDemo from "./command-demo";
import CommandDialog from "./command-dialog";
import ContextWindowDemo from "./context-window-demo";
import ContextWindowFull from "./context-window-full";
import DialogDemo from "./dialog-demo";
import DitherFieldDemo from "./dither-field-demo";
import DitherOrganic from "./dither-organic";
import DrawerDemo from "./drawer-demo";
import DropdownMenuCheckboxes from "./dropdown-menu-checkboxes";
import DropdownMenuDemo from "./dropdown-menu-demo";
import EmptyDemo from "./empty-demo";
import EmptyVariants from "./empty-variants";
import GaugeDemo from "./gauge-demo";
import HeightRule from "./height-rule";
import InputDemo from "./input-demo";
import InputSizes from "./input-sizes";
import InputStates from "./input-states";
import KanbanCardDemo from "./kanban-card-demo";
import KbdDemo from "./kbd-demo";
import MessageDemo from "./message-demo";
import MessageVariants from "./message-variants";
import MotionLiquid from "./motion-liquid";
import OnboardingChecklistDemo from "./onboarding-checklist-demo";
import PopoverDemo from "./popover-demo";
import PopoverInset from "./popover-inset";
import RadioBox from "./radio-box";
import RadioDemo from "./radio-demo";
import ReasoningBlockDemo from "./reasoning-block-demo";
import ReasoningBlockStreaming from "./reasoning-block-streaming";
import ResponseActionsAnswer from "./response-actions-answer";
import ResponseActionsDemo from "./response-actions-demo";
import SelectDemo from "./select-demo";
import SelectSizes from "./select-sizes";
import SeparatorDemo from "./separator-demo";
import SheetDemo from "./sheet-demo";
import SheetSides from "./sheet-sides";
import SidePanelDemo from "./side-panel-demo";
import SkeletonDemo from "./skeleton-demo";
import SourceCardDemo from "./source-card-demo";
import SourceCardFile from "./source-card-file";
import SparklineDemo from "./sparkline-demo";
import StarterPromptDemo from "./starter-prompt-demo";
import StarterPromptEmptyChat from "./starter-prompt-empty-chat";
import StatCardDemo from "./stat-card-demo";
import StatCardGradient from "./stat-card-gradient";
import SwitchBox from "./switch-box";
import SwitchDemo from "./switch-demo";
import TableDemo from "./table-demo";
import TableSelection from "./table-selection";
import TabsDemo from "./tabs-demo";
import TabsLine from "./tabs-line";
import TabsSizes from "./tabs-sizes";
import TabsVertical from "./tabs-vertical";
import TextareaDemo from "./textarea-demo";
import TextareaStates from "./textarea-states";
import TimelineDemo from "./timeline-demo";
import ToggleDemo from "./toggle-demo";
import ToggleGroupDemo from "./toggle-group-demo";
import TooltipDemo from "./tooltip-demo";
import UsageMeterDemo from "./usage-meter-demo";
import WorkloadTileDemo from "./workload-tile-demo";

export const examples: Record<string, ComponentType> = {
  "activity-heatmap-demo": ActivityHeatmapDemo,
  "agent-step-card": AgentStepCard,
  "agent-step-demo": AgentStepDemo,
  "alert-action": AlertAction,
  "alert-demo": AlertDemo,
  "announcement-bar-demo": AnnouncementBarDemo,
  "avatar-demo": AvatarDemo,
  "avatar-group": AvatarGroup,
  "badge-demo": BadgeDemo,
  "button-demo": ButtonDemo,
  "button-group-demo": ButtonGroupDemo,
  "button-group-sizes": ButtonGroupSizes,
  "button-group-vertical": ButtonGroupVertical,
  "button-sizes": ButtonSizes,
  "button-states": ButtonStates,
  "card-demo": CardDemo,
  "card-inset": CardInset,
  "card-sizes": CardSizes,
  "chart-bullet": ChartBullet,
  "chart-capacity-bar": ChartCapacityBar,
  "chart-column": ChartColumn,
  "chart-combo": ChartCombo,
  "chart-donut": ChartDonut,
  "chart-forecast": ChartForecast,
  "chart-funnel": ChartFunnel,
  "chart-gauge": ChartGauge,
  "chart-heatmap": ChartHeatmap,
  "chart-histogram": ChartHistogram,
  "chart-progress-bars": ChartProgressBars,
  "chart-ranking": ChartRanking,
  "chart-response-curve": ChartResponseCurve,
  "chart-scatter": ChartScatter,
  "chart-split-bar": ChartSplitBar,
  "chart-stacked-area": ChartStackedArea,
  "chart-treemap": ChartTreemap,
  "chart-waterfall": ChartWaterfall,
  "chat-composer-demo": ChatComposerDemo,
  "chat-composer-minimal": ChatComposerMinimal,
  "companion-chat": CompanionChat,
  "companion-demo": CompanionDemo,
  "checkbox-box": CheckboxBox,
  "checkbox-demo": CheckboxDemo,
  "chip-demo": ChipDemo,
  "command-demo": CommandDemo,
  "command-dialog": CommandDialog,
  "context-window-demo": ContextWindowDemo,
  "context-window-full": ContextWindowFull,
  "dialog-demo": DialogDemo,
  "dither-field-demo": DitherFieldDemo,
  "dither-organic": DitherOrganic,
  "drawer-demo": DrawerDemo,
  "dropdown-menu-checkboxes": DropdownMenuCheckboxes,
  "dropdown-menu-demo": DropdownMenuDemo,
  "empty-demo": EmptyDemo,
  "empty-variants": EmptyVariants,
  "gauge-demo": GaugeDemo,
  "height-rule": HeightRule,
  "input-demo": InputDemo,
  "input-sizes": InputSizes,
  "input-states": InputStates,
  "kanban-card-demo": KanbanCardDemo,
  "kbd-demo": KbdDemo,
  "message-demo": MessageDemo,
  "message-variants": MessageVariants,
  "motion-liquid": MotionLiquid,
  "onboarding-checklist-demo": OnboardingChecklistDemo,
  "popover-demo": PopoverDemo,
  "popover-inset": PopoverInset,
  "radio-box": RadioBox,
  "radio-demo": RadioDemo,
  "reasoning-block-demo": ReasoningBlockDemo,
  "reasoning-block-streaming": ReasoningBlockStreaming,
  "response-actions-answer": ResponseActionsAnswer,
  "response-actions-demo": ResponseActionsDemo,
  "select-demo": SelectDemo,
  "select-sizes": SelectSizes,
  "separator-demo": SeparatorDemo,
  "sheet-demo": SheetDemo,
  "sheet-sides": SheetSides,
  "side-panel-demo": SidePanelDemo,
  "skeleton-demo": SkeletonDemo,
  "source-card-demo": SourceCardDemo,
  "source-card-file": SourceCardFile,
  "sparkline-demo": SparklineDemo,
  "starter-prompt-demo": StarterPromptDemo,
  "starter-prompt-empty-chat": StarterPromptEmptyChat,
  "stat-card-demo": StatCardDemo,
  "stat-card-gradient": StatCardGradient,
  "switch-box": SwitchBox,
  "switch-demo": SwitchDemo,
  "table-demo": TableDemo,
  "table-selection": TableSelection,
  "tabs-demo": TabsDemo,
  "tabs-line": TabsLine,
  "tabs-sizes": TabsSizes,
  "tabs-vertical": TabsVertical,
  "textarea-demo": TextareaDemo,
  "textarea-states": TextareaStates,
  "timeline-demo": TimelineDemo,
  "toggle-demo": ToggleDemo,
  "toggle-group-demo": ToggleGroupDemo,
  "tooltip-demo": TooltipDemo,
  "usage-meter-demo": UsageMeterDemo,
  "workload-tile-demo": WorkloadTileDemo,
};
