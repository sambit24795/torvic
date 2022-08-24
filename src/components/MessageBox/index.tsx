import { useState, FunctionComponent } from "react";

interface MessageBoxProps {
  sendHandler: (_message: string) => void;
}

const MessageBox: FunctionComponent<MessageBoxProps> = ({ sendHandler }) => {
  const [message, setMessage] = useState<string>("");

  return (
    <div className="flex-col hero-content">
      <textarea
        className="relative w-full border-none rounded-none resize-none textarea textarea-bordered textarea-primary"
        placeholder="type here"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        className="w-32 ml-auto btn btn-primary"
        onClick={() => {
          if (!message) {
            return;
          }

          sendHandler(message.trim());
          setMessage("");
        }}
      >
        send
      </button>
    </div>
  );
};

export default MessageBox;
