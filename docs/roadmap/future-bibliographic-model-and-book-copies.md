# Bavilivre — Future Backend Sprint: Bibliographic Model & Book Copies

> **Status: intentionally postponed — post-MVP**
>
> This sprint is documented now so that the architectural work is not forgotten, but it must **not interrupt the current MVP roadmap**. Bavilivre's immediate priority is to finish the essential user journeys, deploy the application publicly, gather real feedback from friends and early users, and present a working product on the developer's CV and LinkedIn profile. This sprint should be reconsidered only after the MVP is stable enough to be used in real conditions.

## Why this sprint exists

The current model can reasonably treat each `Book` as a book owned by one user during the MVP phase. In the longer term, that model makes it difficult to represent:

- several users owning the same published edition;
- one work published in several languages;
- several translations in the same language;
- revised editions or editions from different publishers;
- borrowing one specific physical copy;
- a catalog that does not display one duplicate card per owner.

The future model separates four responsibilities:

```text
BookWork
   ↓
BookEdition
   ↓
BookCopy
   ↓
Borrowing
```

- `BookWork`: the conceptual work, such as *Clean Code* by Robert C. Martin.
- `BookEdition`: one specific publication or translation, with its language, translators, publisher, publication year, and optional ISBN.
- `BookCopy`: one physical copy of an edition owned by exactly one Bavilivre user.
- `Borrowing`: the loan of one specific physical copy.

Example:

```text
BookWork: Clean Code
│
├── BookEdition: English, 2008, ISBN A
│   ├── BookCopy owned by User 1
│   └── BookCopy owned by User 2
│
├── BookEdition: Persian, translated by Translator A, ISBN B
│   └── BookCopy owned by User 3
│
└── BookEdition: Persian, translated by Translator B, ISBN C
    └── BookCopy owned by User 4
```

## Sprint goal

Evolve Bavilivre from a model where one `Book` combines bibliographic information and user ownership into a model that clearly separates works, published editions or translations, and user-owned physical copies.

At the end of the sprint:

- one work can have several editions and translations;
- one edition can have several independently owned copies;
- ownership, availability, and archive state belong to a copy;
- borrowing targets a specific copy;
- the public catalog is aggregated by edition instead of duplicating identical copies;
- existing data has been migrated safely without speculative merging.

## Placement in the roadmap

### Current decision

This sprint is **intentionally postponed**. The project follows an MVP-first strategy:

1. finish the essential MVP features and stabilize the main journeys;
2. deploy Bavilivre publicly;
3. let friends and early users test it in real conditions;
4. collect evidence about actual catalog, ownership, and borrowing needs;
5. add the deployed project to the developer's CV and LinkedIn profile;
6. reassess and schedule this backend sprint using real feedback.

### Future position

When the project is ready for post-MVP architectural work, this sprint should happen **before major Social & Trust or Administration features become strongly coupled to the current `Book` model**. It should remain independent of a frontend design sprint.

No sprint number is assigned yet. A number and GitHub milestone should be chosen only when the work is actually scheduled.

## Scope decisions

- The main public catalog unit is `BookEdition`, not `BookCopy`.
- Authors remain simple work-level data during this sprint.
- Translators remain simple edition-level data during this sprint.
- Publisher remains a simple edition-level value during this sprint.
- ISBN belongs to an edition, is optional, and must not identify a work by itself.
- Similar titles and authors are never sufficient for automatic merging.
- Data safety takes priority over deduplication.
- Owners retain control of their copies.
- Public exposure of owner information must follow an explicit privacy rule.

## Recommended execution order

| Order | Issue | Depends on |
|---:|---|---|
| 1 | Define the bibliographic domain model | — |
| 2 | Implement persistence | Issue 1 |
| 3 | Migrate existing data safely | Issues 1–2 |
| 4 | Adapt book creation and ownership flows | Issues 1–3 |
| 5 | Aggregate Catalog and Search by edition | Issues 1–4 |
| 6 | Expose edition details and available copies | Issues 1–5 |
| 7 | Make Borrowing reference a specific copy | Issues 1–4; coordinate with Issue 6 |
| 8 | Complete regression tests and documentation | Issues 1–7 |

---

# Issue 1 — Define `BookWork`, `BookEdition`, and `BookCopy` domain model

## Objective

Redesign the Bavilivre book domain so that bibliographic information, published editions or translations, and physical user-owned copies are represented independently.

## Tasks

- Introduce `BookWork`.
- Introduce `BookEdition`.
- Introduce `BookCopy`.
- Define the relationships and ownership boundaries between the three concepts.
- Keep title and authors at work level, unless an edition-specific title is required by an explicit domain rule.
- Keep language, translators, publisher, publication year, and ISBN at edition level.
- Keep owner, availability, archived state, and copy creation date at copy level.
- Define distinct identifiers for works, editions, and copies.
- Review every responsibility of the current `Book` model and decide where it moves.
- Define whether categories belong to a work or an edition and document the decision.
- Define invariants and validation rules for each aggregate.
- Document the domain vocabulary and the principal architectural decisions.
- Add focused unit tests for the domain rules.

## Acceptance criteria

- [ ] Work, edition, and physical copy are separate domain concepts.
- [ ] One work can contain multiple editions.
- [ ] One edition belongs to exactly one work.
- [ ] One edition can have multiple physical copies.
- [ ] One copy belongs to exactly one edition and exactly one user.
- [ ] Different languages can coexist for the same work.
- [ ] Multiple translations in the same language can coexist.
- [ ] Translator information can distinguish translations.
- [ ] ISBN belongs to an edition and is optional.
- [ ] Ownership, availability, and archived state belong only to the copy.
- [ ] The current `Book` responsibilities have a documented destination.
- [ ] Domain rules are covered by automated unit tests.

## Labels

`type: backend` · `architecture` · `refactor` · `testing` · `priority: high`

---

# Issue 2 — Implement persistence for `BookWork`, `BookEdition`, and `BookCopy`

## Objective

Add database mappings, repositories, and integrity constraints for the new bibliographic model without coupling the domain model directly to persistence entities.

## Tasks

- Create persistence entities or records for works, editions, and copies.
- Map `BookWork` to its editions.
- Map `BookEdition` to its copies.
- Map `BookCopy` to its owner.
- Add repository ports and persistence adapters for the three concepts.
- Define transaction boundaries for creating or updating a work, edition, and copy.
- Add foreign keys and indexes for the principal lookup paths.
- Add uniqueness constraints only where identity can be established safely.
- Support editions without an ISBN.
- If ISBN uniqueness is enforced, document its scope and normalization rules.
- Prevent deletion or mutation from silently orphaning editions, copies, or borrowings.
- Add repository and database integration tests.

## Acceptance criteria

- [ ] Works, editions, and copies can be persisted and retrieved independently.
- [ ] Work-to-edition and edition-to-copy relationships load correctly.
- [ ] Several copies can reference the same edition.
- [ ] One user can own several copies, including copies of the same edition if allowed by the domain.
- [ ] An edition can be persisted without an ISBN.
- [ ] Database constraints protect required relationships.
- [ ] Domain objects do not depend directly on persistence framework annotations or entities.
- [ ] Integration tests cover creation, retrieval, relationships, constraints, and optional ISBN values.

## Labels

`type: backend` · `architecture` · `database` · `feature` · `testing` · `priority: high`

---

# Issue 3 — Migrate existing `Book` data to the bibliographic model

## Objective

Provide a safe, observable, and reversible migration path from the current `Book` model to `BookWork` / `BookEdition` / `BookCopy` without losing user or borrowing data.

## Tasks

- Inventory all current `Book` fields, relations, constraints, and production data assumptions.
- Define the mapping of every current field to the new model.
- Preserve owner, title, author, description, language, category, availability, archived state, and relevant timestamps.
- Preserve existing borrowing relationships by mapping them to the generated copy.
- Create the schema migration and backfill process.
- Make the migration deterministic and safe to rerun or resume where practical.
- Record and report rows that cannot be migrated automatically.
- Validate source and destination record counts.
- Do not merge records automatically based only on title, author, description, or approximate similarity.
- Keep records separate whenever there is insufficient evidence that they represent the same edition.
- Document rollback, backup, verification, and deployment steps.
- Test the migration against representative fixtures and a copy of realistic data.

## Migration rule

When there is not enough reliable information to prove that two existing books represent the same edition, keep them separate. Data safety takes priority over automatic deduplication. Duplicate editions may be reviewed and consolidated through a separate future process.

## Acceptance criteria

- [ ] Every existing owned book produces a valid work, edition, and copy structure.
- [ ] Existing ownership, availability, and archive state are preserved.
- [ ] Existing borrowings reference the correct migrated copies.
- [ ] No user-owned book or borrowing is silently dropped.
- [ ] No unsafe automatic deduplication occurs.
- [ ] Unmigrated or ambiguous rows are reported clearly.
- [ ] Automated checks compare source and destination data.
- [ ] Migration, deployment, verification, and rollback procedures are documented.

## Labels

`type: backend` · `database` · `migration` · `data-safety` · `testing` · `priority: high`

---

# Issue 4 — Adapt book creation and ownership flows to `BookCopy`

## Objective

Allow a user to add a physical copy while reusing an existing edition or creating a new edition when necessary, with ownership and copy state managed only at copy level.

## Tasks

- Adapt the Add Book use case to the new model.
- Allow a copy to reference an existing edition.
- Allow a new work or edition to be created when no suitable record exists.
- Define exact matching behavior; do not silently select an edition from approximate title matching.
- Preserve authenticated-owner authorization rules.
- Move availability changes to `BookCopy`.
- Move archive and restore behavior to `BookCopy`.
- Adapt My Books to return the authenticated user's copies.
- Adapt Archived Books to return the authenticated user's archived copies.
- Define DTOs that clearly distinguish work, edition, and copy identifiers.
- Update controllers, application services, mappers, and validation.
- Keep external ISBN lookup and barcode scanning out of scope.
- Add unit, application, and API tests.

## Acceptance criteria

- [ ] Adding a book ultimately creates a `BookCopy` owned by the authenticated user.
- [ ] A copy can reuse an explicitly selected existing edition.
- [ ] A new work or edition can be created without unsafe automatic merging.
- [ ] Ownership is never stored on `BookWork` or `BookEdition`.
- [ ] My Books returns the authenticated user's copies.
- [ ] Archive and restore operate on one owned copy.
- [ ] Availability changes affect only the selected copy.
- [ ] A user cannot update or archive another user's copy without authorization.
- [ ] Updated API contracts and error cases are documented and tested.

## Labels

`type: backend` · `feature` · `refactor` · `api` · `testing` · `priority: high`

---

# Issue 5 — Aggregate Catalog and Search by `BookEdition`

## Objective

Prevent the public catalog from displaying one duplicate card for every physical copy of the same edition while preserving search, filtering, sorting, and pagination.

## Tasks

- Return public catalog results at edition level.
- Calculate the total active copy count for each edition.
- Calculate the currently available copy count for each edition.
- Exclude archived copies from public counts and availability.
- Decide and document whether editions with zero active copies remain visible.
- Search across the relevant work and edition metadata.
- Apply language filtering to edition language.
- Adapt category filtering according to the domain decision from Issue 1.
- Define deterministic sorting, including tie-break behavior.
- Preserve pagination after aggregation.
- Avoid N+1 queries and add suitable database indexes.
- Define a stable catalog DTO containing `workId`, `editionId`, display metadata, `totalCopies`, and `availableCopies`.
- Add tests for multiple copies, editions, languages, translations, empty results, sorting, and page boundaries.

Example response:

```json
{
  "workId": 10,
  "editionId": 42,
  "title": "Clean Code",
  "authors": ["Robert C. Martin"],
  "language": "en",
  "totalCopies": 8,
  "availableCopies": 5
}
```

## Acceptance criteria

- [ ] Multiple active copies of one edition produce one catalog result.
- [ ] Catalog results expose accurate total and available copy counts.
- [ ] Archived copies are excluded from public counts.
- [ ] Different editions remain distinct.
- [ ] Different translations remain distinct, including translations in the same language.
- [ ] Search, filters, sorting, and pagination work on the aggregated result set.
- [ ] Page totals represent editions rather than raw copies.
- [ ] Query performance avoids per-result copy lookups.
- [ ] Catalog behavior is covered by automated tests.

## Labels

`type: backend` · `feature` · `catalog` · `search` · `performance` · `testing` · `priority: high`

---

# Issue 6 — Expose edition details and available book copies

## Objective

Provide the backend contract required to display one edition, its aggregate availability, and the physical copies that may be selected for borrowing without exposing private owner information unintentionally.

## Tasks

- Create an edition-details query or use case.
- Return work and edition metadata.
- Return accurate total and available copy counts.
- Define how a borrowable copy is selected: explicit selection, backend selection, or a separate request flow.
- Define and document which copy and owner fields are public, authenticated-only, or private.
- Prefer stable public display information over exposing internal user identifiers.
- Exclude archived copies from borrowable results.
- Exclude unavailable copies from actions that require availability.
- Preserve owner-specific authorization for copy management.
- Define stable DTOs and expected not-found or forbidden responses.
- Prepare the API for a future frontend edition-details page without implementing that frontend.
- Add privacy, authorization, aggregation, and API tests.

## Acceptance criteria

- [ ] Edition details can be retrieved by edition identifier.
- [ ] The response includes the correct bibliographic metadata and aggregate copy counts.
- [ ] Available copies can be distinguished or selected according to a documented rule.
- [ ] Archived copies are never exposed as borrowable.
- [ ] Unavailable copies cannot be selected for a new borrowing.
- [ ] Owner information follows a documented privacy policy.
- [ ] Unauthorized copy-management information is not exposed.
- [ ] The API is sufficient for a future edition-details page.
- [ ] Privacy and authorization behavior is covered by automated tests.

## Labels

`type: backend` · `feature` · `api` · `privacy` · `authorization` · `testing` · `priority: high`

---

# Issue 7 — Adapt borrowing to physical `BookCopy`

## Objective

Ensure that every borrowing transaction targets one specific user-owned physical copy and that each copy keeps an independent availability lifecycle.

## Tasks

- Replace the current book reference in `Borrowing` with `BookCopyId`.
- Update the Borrow Book use case.
- Update the Return Book use case.
- Update borrowed-books and lent-books queries.
- Derive the lender from the selected copy's owner.
- Validate that the copy exists, is active, is available, and is borrowable.
- Prevent borrowing an archived copy.
- Prevent owners from borrowing their own copy if that is an existing domain rule.
- Preserve all existing authorization and borrowing rules.
- Make availability checks and borrowing creation atomic to prevent two borrowers from acquiring the same copy.
- Ensure returning a borrowing makes only that copy available again.
- Preserve borrowing history when a copy is later archived.
- Define behavior for copy deletion when borrowing history exists.
- Update domain, application, persistence, concurrency, and API tests.

## Domain rules

- A borrowing references exactly one `BookCopy`.
- The lender is the owner of that copy.
- Only an active and available copy can be borrowed.
- Borrowing one copy does not affect other copies of the same edition.
- Returning a borrowing makes that specific copy available again.
- Borrowing history must remain attributable to the original physical copy.

## Acceptance criteria

- [ ] Every borrowing references one physical copy.
- [ ] The copy owner is recorded or derived as the correct lender.
- [ ] Only the borrowed copy becomes unavailable.
- [ ] Other copies of the same edition remain independently available.
- [ ] Archived or unavailable copies cannot be borrowed.
- [ ] Competing requests cannot create two active borrowings for one copy.
- [ ] Returning a borrowing restores the correct copy's availability.
- [ ] Borrowed Books and Lent Books return correct edition and copy information.
- [ ] Existing borrowing history is preserved through the migration.
- [ ] Borrowing rules and concurrency behavior are covered by automated tests.

## Labels

`type: backend` · `feature` · `borrowing` · `refactor` · `concurrency` · `testing` · `priority: high`

---

# Issue 8 — Complete bibliographic model regression tests and documentation

## Objective

Validate the new architecture across Bavilivre's main book, catalog, ownership, archive, and borrowing flows, then document the model and its operational migration.

## Tasks

- Add missing domain regression tests.
- Add missing persistence and migration regression tests.
- Add controller and API contract tests.
- Test multiple copies of one edition.
- Test multiple editions of one work.
- Test multiple translations in the same language.
- Test editions without ISBN.
- Test owners with multiple copies.
- Test archive and restore behavior.
- Test borrow and return behavior.
- Test concurrent borrowing attempts for one copy.
- Test catalog aggregation, filtering, sorting, and pagination.
- Verify authentication, ownership authorization, and owner-data privacy.
- Verify migration reconciliation checks and failure reporting.
- Run the full existing backend test suite and resolve regressions.
- Document the final domain model and API terminology.
- Record architectural decisions and their trade-offs.
- Document deployment, migration, verification, monitoring, and rollback steps.
- Document every improvement intentionally deferred beyond this sprint.

## Acceptance criteria

- [ ] All existing and new backend tests pass.
- [ ] Main book ownership and archive flows pass regression testing.
- [ ] Main borrowing and return flows pass regression testing.
- [ ] Catalog aggregation and search behavior are tested.
- [ ] Edition, language, translator, no-ISBN, and multiple-copy scenarios are tested.
- [ ] Authorization, privacy, migration, and concurrency risks are tested.
- [ ] The final domain model and API vocabulary are documented.
- [ ] Deployment and rollback instructions are usable by another developer.
- [ ] Deferred improvements and known limitations are clearly identified.

## Labels

`type: backend` · `testing` · `documentation` · `regression` · `architecture` · `priority: high`

---

## Definition of Done for the sprint

The sprint is complete only when:

- all eight issues satisfy their acceptance criteria;
- existing data is migrated and reconciled without silent loss;
- the main catalog, ownership, archive, and borrowing journeys pass regression tests;
- public and private owner information follow documented rules;
- the deployed database migration has a verified rollback or recovery procedure;
- API contracts and architectural decisions are documented;
- corresponding frontend work is recorded separately rather than added informally to this backend sprint.

## Deferred future improvements

The following improvements are intentionally outside this sprint and may become separate issues when real user feedback justifies them:

- automatic metadata retrieval from ISBN;
- barcode or ISBN scanning;
- cover retrieval from Google Books, Open Library, or another provider;
- intelligent duplicate detection and automatic edition merging;
- an admin-assisted duplicate review and merge workflow;
- rich `Author`, `Translator`, `Contributor`, or `Publisher` entities;
- collaborative editing and moderation of bibliographic metadata;
- edition-specific alternate titles and richer contributor roles;
- detailed physical condition, notes, photos, or copy history;
- geographic location and distance-based copy discovery;
- automatic selection of the best lender;
- reservations or waiting lists when all copies are unavailable;
- recommendation and discovery features;
- a complete frontend redesign for edition-level catalog and copy selection;
- integrations with external bibliographic services;
- analytics beyond the minimum required for migration verification.

## Future scheduling checklist

Before moving this document into GitHub:

- [ ] Confirm that the MVP is deployed and its essential journeys are stable.
- [ ] Review feedback from real users about duplicate books, languages, translations, and copy selection.
- [ ] Recheck the current backend model and naming because it may have evolved.
- [ ] Assign the sprint or milestone a real roadmap number.
- [ ] Create the eight GitHub issues in the recommended order.
- [ ] Replace dependency names with the real GitHub issue numbers.
- [ ] Confirm the labels available in the repository and create missing ones if useful.
- [ ] Add estimates only after reviewing the current code and production data.
- [ ] Link any corresponding frontend issues without expanding this backend sprint's scope.

## Guiding rule

> **Work = which conceptual book? Edition = which publication or translation? Copy = which physical item, and who owns it? Borrowing = who borrows that exact copy?**

This architecture is deliberately saved for later. The present success criterion for Bavilivre is not architectural completeness: it is a focused MVP that is finished, deployed, tested by real people, and strong enough to demonstrate publicly on a CV and LinkedIn.
