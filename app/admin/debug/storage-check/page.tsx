"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface StorageDetails {
  success: boolean;
  bucketName: string;
  fileCount: number;
  testImageUrl?: string;
  error?: string;
  details: string;
  suggestedBucket?: string | null;
}

interface ConfigInfo {
  bucketName: string;
  hasSupabaseUrl: boolean;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  environment: string;
}

interface StorageCheckResult {
  success: boolean;
  message: string;
  storageDetails: StorageDetails;
  configInfo: ConfigInfo;
  error?: string;
}

export default function StorageDebugPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<StorageCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testImageUrl, setTestImageUrl] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkStorage() {
      try {
        setLoading(true);
        const response = await fetch("/api/debug/storage-check");

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setResult(data);

        if (data.storageDetails.testImageUrl) {
          setTestImageUrl(data.storageDetails.testImageUrl);
        }
      } catch (err) {
        console.error("Error checking storage:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    checkStorage();
  }, []);

  const handleTestCustomUrl = async () => {
    if (!customImageUrl) return;

    try {
      const response = await fetch(
        `/api/debug/transform-url?url=${encodeURIComponent(customImageUrl)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setProcessedUrl(data.transformedUrl);
    } catch (err) {
      console.error("Error transforming URL:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Storage Configuration Debug</h1>
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-6 h-6 border-2 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="ml-2">Checking storage configuration...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error checking storage</p>
          <p>{error}</p>
        </div>
      ) : result ? (
        <div>
          {/* Overall Status */}
          <div
            className={`mb-6 p-4 rounded ${
              result.success
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">
              {result.success
                ? "✅ Storage Check Passed"
                : "❌ Storage Check Failed"}
            </h2>
            <p>{result.message}</p>
            {result.error && (
              <p className="mt-2 font-semibold">Error: {result.error}</p>
            )}
          </div>

          {/* Configuration Details */}
          <div className="mb-6 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">
              Configuration Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-semibold">Environment:</span>{" "}
                {result.configInfo.environment}
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-semibold">Storage Bucket:</span>{" "}
                {result.configInfo.bucketName}
              </div>
              <div
                className={`p-3 rounded ${
                  result.configInfo.hasSupabaseUrl
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <span className="font-semibold">Supabase URL:</span>{" "}
                {result.configInfo.hasSupabaseUrl ? "✅ Set" : "❌ Missing"}
              </div>
              <div
                className={`p-3 rounded ${
                  result.configInfo.hasAnonKey ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <span className="font-semibold">Anon Key:</span>{" "}
                {result.configInfo.hasAnonKey ? "✅ Set" : "❌ Missing"}
              </div>
              <div
                className={`p-3 rounded ${
                  result.configInfo.hasServiceKey
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <span className="font-semibold">Service Key:</span>{" "}
                {result.configInfo.hasServiceKey ? "✅ Set" : "❌ Missing"}
              </div>
            </div>
          </div>

          {/* Storage Details */}
          <div className="mb-6 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Storage Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-semibold">Storage Status:</span>{" "}
                {result.storageDetails.success
                  ? "✅ Operational"
                  : "❌ Issues Detected"}
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-semibold">Bucket Name:</span>{" "}
                {result.storageDetails.bucketName}
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-semibold">File Count:</span>{" "}
                {result.storageDetails.fileCount}
              </div>
              {result.storageDetails.suggestedBucket && (
                <div className="bg-yellow-100 p-3 rounded">
                  <span className="font-semibold">Suggested Bucket:</span>{" "}
                  {result.storageDetails.suggestedBucket}
                </div>
              )}
              <div className="md:col-span-2 bg-gray-100 p-3 rounded">
                <span className="font-semibold">Details:</span>{" "}
                {result.storageDetails.details}
              </div>
            </div>
          </div>

          {/* Test Image */}
          {testImageUrl && (
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Test Image</h2>
              <div className="border border-gray-300 p-2 rounded mb-4">
                <p className="mb-2 font-mono text-sm break-all">
                  {testImageUrl}
                </p>
              </div>
              <div className="relative h-64 w-full bg-gray-200 rounded">
                <Image
                  src={testImageUrl}
                  alt="Test storage image"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    console.error("Error loading test image");
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite error loop
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Custom URL Test */}
          <div className="mb-6 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Test Custom URL</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Enter image URL to test transformation"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTestCustomUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                disabled={!customImageUrl}
              >
                Test
              </button>
            </div>

            {processedUrl && (
              <>
                <div className="border border-gray-300 p-2 rounded mb-4">
                  <p className="mb-1 font-semibold">Original URL:</p>
                  <p className="mb-2 font-mono text-sm break-all">
                    {customImageUrl}
                  </p>
                  <p className="mb-1 font-semibold">Transformed URL:</p>
                  <p className="font-mono text-sm break-all">
                    {processedUrl || "No valid URL returned"}
                  </p>
                </div>
                {processedUrl && (
                  <div className="relative h-64 w-full bg-gray-200 rounded">
                    <Image
                      src={processedUrl}
                      alt="Custom URL test"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        console.error("Error loading custom image");
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No result data available.
        </div>
      )}
    </div>
  );
}
