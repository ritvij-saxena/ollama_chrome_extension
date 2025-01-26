chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "askOllama") {
    checkIfServerIsActive()
      .then((response) => {
        if (!response.ok) {
          alert(
            "Server is not running. Check the README.md on how to start the server."
          );
          console.log(
            "Server is not running. Check the README.md on how to start the server."
          );
          return;
        }

        let originalActiveElement;
        let text = "";

        // Check if there's an active text input or selected text
        if (
          document.activeElement &&
          (document.activeElement.isContentEditable ||
            document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
            document.activeElement.nodeName.toUpperCase() === "INPUT")
        ) {
          originalActiveElement = document.activeElement;
          text =
            (document.getSelection()?.toString() || "").trim() ||
            (document.activeElement.value || "").trim() ||
            (document.activeElement.textContent || "").trim();
        } else {
          text = (document.getSelection()?.toString() || "").trim();
        }

        if (!text) {
          alert(
            "No text found. Select this option after right clicking on a textarea that contains text or on a selected portion of text."
          );
          return;
        }

        showLoadingCursor();

        // Send the text to the API endpoint
        fetch("http://localhost:8080/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            const activeElement =
              originalActiveElement ||
              (document.activeElement.isContentEditable &&
                document.activeElement);

            if (activeElement) {
              if (
                activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
                activeElement.nodeName.toUpperCase() === "INPUT"
              ) {
                setTimeout(() => {
                  activeElement.value += `\n\n${data.reply}`;
                  activeElement.dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                }, 100);
              } else {
                const replyNode = document.createTextNode(`\n\n${data.reply}`);
                const selection = window.getSelection();

                if (selection.rangeCount === 0) {
                  selection.addRange(document.createRange());
                  selection.getRangeAt(0).collapse(activeElement, 1);
                }

                const range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(replyNode);
                selection.collapse(replyNode, replyNode.length);

                setTimeout(() => {
                  activeElement.dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                }, 100);
              }
            } else {
              alert(`Ollama says: ${data.reply}`);
            }

            restoreCursor();
          })
          .catch((error) => {
            restoreCursor();
            console.error("Error during the API call:", error);
            alert("Error. Port is occupied or request failed.");
          });
      })
      .catch((error) => {
        alert("Error checking server status: " + error);
        console.error("Error checking server status: ", error);
      });
  }
});

const showLoadingCursor = () => {
  const style = document.createElement("style");
  style.id = "cursor_wait";
  style.innerHTML = `* {cursor: wait;}`;
  document.head.insertBefore(style, null);
};

const restoreCursor = () => {
  document.getElementById("cursor_wait").remove();
};

function checkIfServerIsActive() {
  return fetch("http://localhost:8080/debug", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
