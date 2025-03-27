import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveDraft, deleteDraft, loadDrafts } from "../store/slices/draftSlice";
import { setRole } from "../store/slices/userSlice";
import { Loader2, Save, Trash, Eye, Edit, Upload, X } from "lucide-react";
import RichTextEditor from "../components/RichEditor";
import { Button } from "../components/ui/Button";
import { MdOutlineChangeCircle } from "react-icons/md";
import { gapi } from "gapi-script";
import UploadToDriveButton from "../components/UploadToDriveButton";

// 🔥 Google API Config
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export default function LetterEditor() {
  const dispatch = useDispatch();
  const drafts = useSelector((state) => state.drafts.drafts);
  const userRole = useSelector((state) => state.user.role);

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Letter");
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingDraft, setViewingDraft] = useState(null);

  // 🔹 Load drafts & initialize Google API on mount
  useEffect(() => {
    dispatch(loadDrafts());

    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
          scope: SCOPES,
        })
        .catch((error) =>
          console.error("Google API Initialization Error:", error)
        );
    });
  }, [dispatch]);

  // 🔹 Save Draft Handler
  const handleSaveDraft = () => {
    const textContent = content.replace(/<[^>]+>/g, "").trim();
    if (!textContent) {
      alert("❌ Cannot save an empty letter!");
      return;
    }

    setIsSaving(true);

    const draftData = {
      id: selectedDraftId,
      title,
      content,
      isUpdate: !!selectedDraftId,
    };
    dispatch(saveDraft(draftData));

    alert(selectedDraftId ? "✅ Draft updated!" : "✅ Draft saved!");
    resetEditor();
  };

  // 🔹 Reset Editor
  const resetEditor = () => {
    setContent("");
    setTitle("Untitled Letter");
    setSelectedDraftId(null);
    setViewingDraft(null);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      {/* 🔹 Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold border-b focus:outline-none bg-transparent mb-2 p-2"
        placeholder="Letter Title"
      />

      {/* 🔹 Rich Text Editor */}
      <div className="border rounded-md">
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {/* 🔹 Admin Controls */}
      {userRole === "admin" && (
        <div className="flex gap-2">
          <Button onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {selectedDraftId ? "Update Draft" : "Save Draft"}
          </Button>

          <UploadToDriveButton content={content} title={title} />
        </div>
      )}

      {/* 🔹 Role Toggle */}
      <div className="mt-4 flex items-center justify-between">
        <strong>Role: {userRole.toUpperCase()}</strong>
        <button
          onClick={() =>
            dispatch(setRole(userRole === "admin" ? "user" : "admin"))
          }
          className="flex items-center"
        >
          <MdOutlineChangeCircle
            size={30}
            className="cursor-pointer text-blue-600"
          />
          <span className="ml-2">Change Role</span>
        </button>
      </div>

      {/* 🔹 Draft Preview Modal */}
      {viewingDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{viewingDraft.title}</h2>
              <button onClick={() => setViewingDraft(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: viewingDraft.content }}
            />
          </div>
        </div>
      )}

      {/* 🔹 Drafts List */}
      <div className="mt-4">
        <h3 className="font-bold text-lg">My Drafts</h3>
        {drafts.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No drafts saved yet.</p>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-3 border rounded-md flex justify-between items-center bg-gray-100 shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-gray-700">{draft.title}</h3>
                  <p className="text-sm text-gray-500">Saved on {draft.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewingDraft(draft)}
                    variant="secondary"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>

                  {userRole === "admin" && (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedDraftId(draft.id);
                          setTitle(draft.title);
                          setContent(draft.content);
                          setViewingDraft(null);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        onClick={() => dispatch(deleteDraft(draft.id))}
                        variant="destructive"
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
