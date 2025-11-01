import React, { useState } from 'react'
import '../styles/file-metadata.css'
import type { AnalyseResult } from '../services/file-metadata/types'
import { uploadFile } from '../services/file-metadata/api'

export default function ServiceFileMetadata() {
    const [file, setFile] = useState<File | null>(null)
    const [result, setResult] = useState<AnalyseResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleUpload(e?: React.FormEvent) {
        e?.preventDefault()
        setError(null)
        setResult(null)

        if (!file) {
            setError('Please select a file to upload.')
            return
        }
        try {
            setLoading(true)
            const data = await uploadFile(file)
            setResult(data)
        } catch (err: any) {
            setError(err.message || String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <h1>File Metadata</h1>
            <p>Upload a file to get its name, type, and size in bytes.</p>

            <form className="upload-card" onSubmit={handleUpload}>
                <div className="input-group">
                    <label htmlFor="file-input">Choose a file</label>
                    <input
                        id="file-input"
                        name="upfile"
                        type="file"
                        className="file-input"
                        aria-label="File input"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="controls">
                    <button type="submit" className="btn primary" disabled={loading} aria-label="Upload file">
                        {loading ? 'Uploading…' : 'Upload'}
                    </button>
                    {file && (
                        <div className="file-chip" aria-live="polite" title={`${file.name} (${file.type || 'unknown'}, ${file.size} bytes)`}>
                            Selected: {file.name}
                        </div>
                    )}
                </div>
            </form>

            {error && <div className="error" role="alert">Error: {error}</div>}

            <div className="result" aria-live="polite">
                {result ? (
                    <div className="meta-grid">
                        <div>
                            <div className="meta-label">Name</div>
                            <div className="meta-value">{result.name}</div>
                        </div>
                        <div>
                            <div className="meta-label">Type</div>
                            <div className="meta-value">{result.type || 'unknown'}</div>
                        </div>
                        <div>
                            <div className="meta-label">Size (bytes)</div>
                            <div className="meta-value">{result.size}</div>
                        </div>
                    </div>
                ) : (
                    <div>No upload yet. Pick a file and press Upload.</div>
                )}
            </div>
        </div>
    )
}
