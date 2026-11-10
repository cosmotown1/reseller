# Verisign IDN registration

For a Verisign IDN registration, send the domain in Punycode and provide a
valid three-letter `idn_language` tag. The tag is required for Verisign IDNs
and is not inferred from the domain. It is not needed for ordinary ASCII
registrations.

A Korean IDN request, for example, uses `idn_language: "KOR"`:

```json
{
  "domain": "xn--jj0b55g3tjca397l20aea895t.com",
  "idn_language": "KOR",
  "years": 1,
  "ns": ["ndns1.cosmotown.com", "ndns2.cosmotown.com"]
}
```

The [language-tag JSON reference](../reference/verisign-idn-language-tags.json)
contains the valid tags and language names from Verisign's published list.
This list is not the same as the languages with an explicit character
allow-list.

Verisign's [IDN Registration Rules](https://www.verisign.com/resources/internationalized-domain-names/idn-registration-rules/)
define **Restrictions on Specific Languages** for these tags: `AZE`, `BEL`,
`BUL`, `CHI`, `GRE`, `JPN`, `KOR`, `KUR`, `MAC`, `MOL`, `POL`, `RUS`, and
`UKR`. For these languages, every code point in the requested IDN must be
included in Verisign's character list for the specified language; otherwise,
the registration is rejected.

For other valid tags, Verisign applies its script-commingling restriction:
characters from different Unicode scripts cannot be mixed in one IDN label.
Verisign also disallows Latin Small Letter Sharp S (`U+00DF`, `ß`) and Greek
Small Letter Final Sigma (`U+03C2`, `ς`). A valid tag therefore does not
guarantee that a particular domain label can be registered.

Sources: [Verisign IDN Registration Rules](https://www.verisign.com/resources/internationalized-domain-names/idn-registration-rules/)
and [Verisign valid language tags (PDF)](https://www.verisign.com/assets/idn-valid-language-tags.pdf).

See the [registration API reference](../../README.md#domain-register) for the
request fields and response format.
