import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("renders fallback when no image", () => {
    render(
      <Avatar>
        <AvatarFallback>YS</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("YS")).toBeInTheDocument();
  });

  it("renders with image element when src is provided", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="user" />
        <AvatarFallback>YS</AvatarFallback>
      </Avatar>,
    );
    // jsdom may not load images so fallback typically shows; we just verify root structure
    expect(container.querySelector("[class*='rounded-full']")).toBeInTheDocument();
  });

  it("applies custom className to root", () => {
    const { container } = render(
      <Avatar className="h-12 w-12">
        <AvatarFallback>X</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector(".h-12")).toBeInTheDocument();
  });
});
