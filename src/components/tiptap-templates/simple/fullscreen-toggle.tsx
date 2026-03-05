import { Button } from "@/components/tiptap-ui-primitive/button"
import { MaximizeIcon } from "@/components/tiptap-icons/maximize-icon"
import { MinimizeIcon } from "@/components/tiptap-icons/minimize-icon"

export function FullscreenToggle({
    isFullscreen,
    onToggle
}: {
    isFullscreen: boolean,
    onToggle: () => void
}) {
    return (
        <Button
            onClick={onToggle}
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            variant="ghost"
        >
            {isFullscreen ? (
                <MinimizeIcon className="tiptap-button-icon" />
            ) : (
                <MaximizeIcon className="tiptap-button-icon" />
            )}
        </Button>
    )
}
