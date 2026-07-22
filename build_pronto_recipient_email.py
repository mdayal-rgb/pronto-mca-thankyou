#!/usr/bin/env python3
"""Build and deploy a Pronto Cares food-recipient email into MCA."""

import shutil
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path.home() / ".cursor/skills/deploy-mca-email/scripts"))
from mca import (  # noqa: E402
    SPACE_LG,
    SPACE_MD,
    SPACE_XL,
    button_block,
    data_graph_providers,
    deploy_email,
    divider_block,
    ensure_brand,
    ensure_workspace,
    footer_section,
    heading_block,
    image_block,
    paragraph_block,
    section1,
    section_padded,
    session,
    upload_image,
)

BRAND_NAME = "Pronto Cares"
BRAND = "Pronto"
PRIMARY = "#FF6A1A"
ACCENT = "#E8590C"
ORG_ADDRESS = "Pronto Cares Community Distribution Network"
ORG_URL = "https://example.org/pronto-cares"
CHAT_URL = "https://pronto-cares.my.salesforce-sites.com/chatwithproto"
SUBJECT = "Your meal delivery is confirmed for today"
PREHEADER = "We matched your meal and completed safety checks."
DATA_GRAPH_API_NAME = "ProntoRecipientGraph"

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
            "Pronto Cares rescues surplus food and delivers meals to seniors, students, "
            "and families with reliable, safety-checked distribution."
        ),
        tone_of_voice=(
            "Warm, clear, and reassuring. Use short practical sentences. "
            "Be calm and precise about food safety and delivery updates."
        ),
        personality_name="Warm Trusted Neighbor",
    )

    primary_logo_key = upload_image(
        token,
        instance,
        workspace,
        file_path=primary_logo_path,
        title="Pronto Primary Logo",
        api_name=f"{BRAND}_Logo_Primary_v3",
        alt_text="Pronto logo",
    )
    cares_lockup_key = upload_image(
        token,
        instance,
        workspace,
        file_path=cares_lockup_path,
        title="Pronto Cares Lockup",
        api_name=f"{BRAND}_Cares_Lockup_v3",
        alt_text="Pronto Cares lockup logo",
    )

    sections = [
        section1([image_block(primary_logo_key, "Pronto logo", width_pct=34)]),
        section_padded(
            [
                image_block(cares_lockup_key, "Pronto Cares logo", width_pct=38),
                heading_block("Your meal is on the way.", level=1),
                paragraph_block(
                    "Hi {!$recipient.FirstName},\n\n"
                    "Your meal has been matched and is scheduled for delivery today between {!$recipient.DeliveryWindow}."
                ),
            ],
            top=SPACE_XL,
            bottom=SPACE_LG,
        ),
        section_padded(
            [
                heading_block("What we checked before dispatch", level=2),
                paragraph_block(
                    "Your meal was matched to your delivery details.\n"
                    "Safety and temperature checks were completed.\n"
                    "Your delivery notes were reviewed for a smooth handoff."
                ),
            ],
            top=SPACE_MD,
            bottom=SPACE_LG,
        ),
        section_padded(
            [
                heading_block("Today's delivery details", level=2),
                paragraph_block(
                    "Delivery window: {!$recipient.DeliveryWindow}\n"
                    "Drop-off instructions: {!$recipient.DropoffInstructions}\n"
                    "Driver updates: {!$recipient.TrackingLink}"
                ),
            ],
            top=SPACE_MD,
            bottom=SPACE_LG,
        ),
        section_padded([divider_block(color=PRIMARY, width_pct=18, thickness_px=2)], top=SPACE_MD, bottom=SPACE_MD),
        section_padded(
            [
                paragraph_block(
                    "Need to confirm details or share an update?\n"
                    "Our AI assistant can help with distribution updates right away.\n\n"
                    "If your meal is delayed or you missed delivery, chat now for priority help."
                ),
                button_block("CHAT WITH PROTO", CHAT_URL, bg_color=PRIMARY, text_color="#FFFFFF"),
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
    api_name = f"{BRAND}_RecipientDelivery_{version}"
    title = f"{BRAND} - Recipient Delivery Confirmation"

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
        data_providers=data_graph_providers(DATA_GRAPH_API_NAME, expression_key="recipient"),
    )

    print(f"[OK] {result['title']}")
    print(f"URL: {result['url']}")
    print(f"ID: {result['id']}")
    print(f"Status: {result['status']}")


if __name__ == "__main__":
    main()
