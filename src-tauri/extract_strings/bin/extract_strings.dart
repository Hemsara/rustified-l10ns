import 'dart:io';
import 'package:analyzer/dart/analysis/utilities.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';

void main(List<String> args) {
  if (args.isEmpty) {
    print("Usage: dart extract_strings.dart <file.dart>");
    return;
  }

  final filePath = args[0];
  final content = File(filePath).readAsStringSync();

  final parseResult = parseString(content: content);
  final unit = parseResult.unit;

  unit.visitChildren(_WidgetStringVisitor());
}

class _WidgetStringVisitor extends RecursiveAstVisitor<void> {
  @override
  void visitClassDeclaration(ClassDeclaration node) {
    final superName = node.extendsClause?.superclass.toSource();
    if (superName != null &&
        (superName.contains('StatelessWidget') ||
            superName.contains('StatefulWidget') ||
            superName.contains('State'))) {
      for (final method in node.members.whereType<MethodDeclaration>()) {
        method.visitChildren(_StringLiteralVisitor());
      }

      node.members.whereType<FieldDeclaration>().forEach((field) {
        field.visitChildren(_StringLiteralVisitor());
      });
    }
  }
}

class _StringLiteralVisitor extends RecursiveAstVisitor<void> {
  final Set<String> _seenStrings = {};

  @override
  void visitSimpleStringLiteral(SimpleStringLiteral node) {
    final value = node.value;
    if (value.isNotEmpty &&
        !_isMapKey(node) &&
        !_isNonUIString(value) &&
        !_seenStrings.contains(value)) {
      _seenStrings.add(value);
      print(value);
    }
  }

  bool _isNonUIString(String value) {
    if (value.startsWith('/')) return true;

    if (RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        .hasMatch(value)) return true;

    if (RegExp(r'^\+?[\d\s\-()]+$').hasMatch(value) &&
        value.replaceAll(RegExp(r'[\s\-()]'), '').length >= 7) return true;

    if (RegExp(r'^(https?://|www\.)').hasMatch(value)) return true;

    return false;
  }

  @override
  void visitStringInterpolation(StringInterpolation node) {
    var source = node.toSource();
    if ((source.startsWith("'") && source.endsWith("'")) ||
        (source.startsWith('"') && source.endsWith('"'))) {
      source = source.substring(1, source.length - 1);
    }
    if (!_seenStrings.contains(source)) {
      _seenStrings.add(source);
      print(source);
    }
  }

  bool _isMapKey(SimpleStringLiteral node) {
    final parent = node.parent;
    if (parent is MapLiteralEntry && parent.key == node) {
      return true;
    }
    if (parent is IndexExpression) {
      return true;
    }
    if (parent is NamedExpression && parent.name.label.name == 'value') {
      return true;
    }
    return false;
  }
}
