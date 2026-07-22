#!/usr/bin/env python3
"""Build and deploy a Pronto Cares donor thank-you email into MCA."""

import sys
import shutil
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path.home() / ".cursor/skills/deploy-mca-email/scripts"))
from mca import (  # noqa: E402
    SPACE_LG,
    SPACE_MD,
    SPACE_XL,
    button_block,
    divider_block,
    deploy_email,
    ensure_brand,
    ensure_workspace,
    footer_section,
    header_section,
    heading_block,
    image_block,
    paragraph_block,
    section_padded,
    session,
    upload_image,
)


BRAND_NAME = "Pronto Cares"
BRAND = "Pronto"
PRIMARY = "#FF6A1A"
ACCENT = "#E8590C"
DONATE_URL = "https://example.org/pronto-cares-donate"
ORG_URL = "https://example.org/pronto-cares"
ORG_ADDRESS = "Pronto Cares Community Distribution Network"
SUBJECT = "Thank you for donating food to a neighbor in need"
PREHEADER = "Your donation helps deliver warm, safe meals with dignity."
PRIMARY_LOGO_SOURCE = Path("/Users/mdayal/Downloads/pronto-logo-primary.png")
CARES_LOCKUP_SOURCE = Path("/Users/mdayal/Downloads/pronto-cares-lockup.png")


def prepare_logo_assets(work_dir: Path) -> tuple[Path, Path]:
    work_dir.mkdir(parents=True, exist_ok=True)
    primary_logo_path = work_dir / "pronto-logo-primary.png"
    cares_lockup_path = work_dir / "pronto-cares-lockup.png"

    if not PRIMARY_LOGO_SOURCE.exists() or not CARES_LOCKUP_SOURCE.exists():
        raise FileNotFoundError(
            "Expected logo files were not found in Downloads: "
            "pronto-logo-primary.png and pronto-cares-lockup.png"
        )

    shutil.copyfile(PRIMARY_LOGO_SOURCE, primary_logo_path)
    shutil.copyfile(CARES_LOCKUP_SOURCE, cares_lockup_path)
    return primary_logo_path, cares_lockup_path


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    assets_dir = script_dir / "extracted_images"

    primary_logo_path, cares_lockup_path = prepare_logo_assets(assets_dir)

    token, instance = session()
    workspace = ensure_workspace(token, instance, name=BRAND_NAME)
    brand_key = ensure_brand(
        token,
        instance,
        workspace,
        name=BRAND_NAME,
        primary_hex=PRIMARY,
        accent_hex=ACCENT,
        font_family="arial",
        api_name=f"{BRAND}_Brand",
        description=(
            "Pronto Cares rescues surplus food and routes it to seniors, students, and families "
            "experiencing food insecurity through trusted local delivery."
        ),
        tone_of_voice=(
            "Warm, reassuring, and clear. Use plain language and short sentences. "
            "Be precise and calm when referencing food safety checks. "
            "Honor dignity and gratitude, never pity or alarmist language."
        ),
        personality_name="Warm Trusted Neighbor",
    )

    primary_logo_key = upload_image(
        token,
        instance,
        workspace,
        file_path=primary_logo_path,
        title="Pronto Primary Logo",
        api_name=f"{BRAND}_Logo_Primary_v2",
        alt_text="Pronto logo",
    )
    cares_lockup_key = upload_image(
        token,
        instance,
        workspace,
        file_path=cares_lockup_path,
        title="Pronto Cares Lockup",
        api_name=f"{BRAND}_Cares_Lockup_v2",
        alt_text="Pronto Cares lockup logo",
    )

    sections = [
        header_section(
            primary_logo_key,
            DONATE_URL,
            primary_hex=PRIMARY,
            donate_label="DONATE AGAIN",
            logo_alt="Pronto logo",
        ),
        section_padded(
            [
                image_block(cares_lockup_key, "Pronto Cares logo", width_pct=38),
                heading_block("Thank you for helping feed a neighbor.", level=1),
                paragraph_block(
                    "Your donated food was matched, safety-checked, and delivered with care by the Pronto Cares fleet."
                ),
            ],
            top=SPACE_XL,
            bottom=SPACE_LG,
        ),
        section_padded(
            [
                heading_block("What your donation made possible", level=2),
                paragraph_block(
                    "Your donation was matched to a household in need.\n"
                    "Food safety and temperature checks were completed before dispatch.\n"
                    "A trusted local driver delivered the meal with dignity."
                ),
            ],
            top=SPACE_MD,
            bottom=SPACE_LG,
        ),
        section_padded(
            [divider_block(color=PRIMARY, width_pct=18, thickness_px=2)],
            top=SPACE_MD,
            bottom=SPACE_MD,
        ),
        section_padded(
            [
                paragraph_block(
                    "Pronto Cares combines food rescue with human care. "
                    "Thank you for making sure good food reaches the people who need it most."
                ),
                button_block("SEE YOUR IMPACT", ORG_URL, bg_color=PRIMARY, text_color="#FFFFFF"),
            ],
            top=SPACE_MD,
            bottom=SPACE_XL,
        ),
        footer_section(
            org_name=BRAND_NAME,
            org_address=ORG_ADDRESS,
            year=2026,
            privacy_url=f"{ORG_URL}/privacy",
            unsubscribe_url="[UNSUBSCRIBE_URL]",
        ),
    ]

    version = datetime.now().strftime("%Y%m%d%H%M%S")
    api_name = f"{BRAND}_DonorThanks_{version}"
    title = f"{BRAND} - Donor Thank You"

    result = deploy_email(
        token,
        instance,
        workspace,
        api_name=api_name,
        title=title,
        subject=SUBJECT,
        preheader=PREHEADER,
        sections=sections,
        brand_key=brand_key,
    )

    print(f"[OK] {result['title']}")
    print(f"URL: {result['url']}")
    print(f"ID: {result['id']}")
    print(f"Status: {result['status']}")


if __name__ == "__main__":
    main()
