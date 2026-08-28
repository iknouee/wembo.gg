'use client'

import { ImageIcon } from 'lucide-react'

interface EmbedPreviewProps {
  title: string
  description: string
  color: string
  imageUrl: string
  thumbnailUrl: string
  footerText: string
  username?: string
  serverName?: string
  memberCount?: number
}

function replaceVariables(text: string, username: string, serverName: string, memberCount: number) {
  return text
    .replace(/\{user\}/g, username)
    .replace(/\{server\}/g, serverName)
    .replace(/\{membercount\}/g, memberCount.toLocaleString())
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export function EmbedPreview({
  title,
  description,
  color,
  imageUrl,
  thumbnailUrl,
  footerText,
  username = 'NewMember',
  serverName = 'Wembo Community',
  memberCount = 12483,
}: EmbedPreviewProps) {
  const parsedTitle = replaceVariables(title, username, serverName, memberCount)
  const parsedDescription = replaceVariables(description, username, serverName, memberCount)
  const parsedFooter = replaceVariables(footerText, username, serverName, memberCount)

  return (
    <div className="rounded-lg bg-[#2b2d31] p-4 max-w-md">
      <div className="flex gap-3">
        <div
          className="w-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: color || '#5865F2' }}
        />
        <div className="flex-1 min-w-0 space-y-2">
          {parsedTitle && (
            <h4 className="text-sm font-semibold text-white">{parsedTitle}</h4>
          )}
          {parsedDescription && (
            <p
              className="text-sm text-[#dbdee1] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedDescription) }}
            />
          )}
          {thumbnailUrl && (
            <div className="mt-2">
              <div className="h-16 w-16 rounded-lg bg-[#1e1f22] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbnailUrl} alt="Thumbnail" className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          {imageUrl && (
            <div className="mt-2">
              <div className="w-full h-40 rounded-lg bg-[#1e1f22] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Embed image" className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          {parsedFooter && (
            <div className="pt-2 border-t border-[#3f4147]">
              <p className="text-xs text-[#949ba4]">{parsedFooter}</p>
            </div>
          )}
        </div>
      </div>
      {!parsedTitle && !parsedDescription && (
        <div className="flex items-center justify-center py-8 text-[#949ba4]">
          <div className="text-center space-y-2">
            <ImageIcon className="h-8 w-8 mx-auto opacity-50" />
            <p className="text-xs">Configure your embed to see a preview</p>
          </div>
        </div>
      )}
    </div>
  )
}
